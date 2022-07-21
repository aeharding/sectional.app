import L, { Coords, DoneCallback, LatLngBoundsExpression } from "leaflet";
import { useEffect, useRef } from "react";
import tiler from "./tiler";

let tileCallbacks: any = {};

// Calculated min/max/nodata for the file, used for each tile request
let fileStats: any;

const WorkerTiles = L.GridLayer.extend({
  createTile: function (coords: Coords, done: DoneCallback) {
    var uLPix = {
      x: coords.x * 256, // In real life, "this.getTileSize()"
      y: coords.y * 256,
    };
    var lRPix = {
      x: uLPix.x + 256,
      y: uLPix.y + 256,
    }; // Ditto

    var map = this._map; // TODO: Don't rely on Leaflet internals
    var uLGeo = map.unproject(uLPix, coords.z);
    var lRGeo = map.unproject(lRPix, coords.z);

    var tile = document.createElement("img");
    tiler.postMessage({
      tile: {
        upperLeft: uLGeo,
        lowerRight: lRGeo,
        coords: coords,
        stats: fileStats,
      },
    });
    var callback = function (bytes: any) {
      // This doesn't really seem to make a difference, but it's quicker.
      // TODO: Make empty tiles not show up as broken images
      if (bytes.length === 0) {
        done(undefined, undefined);
      } else {
        var outputBlob = new Blob([bytes], { type: "image/png" });
        var imageURL = window.URL.createObjectURL(outputBlob);
        tile.src = imageURL;
        done(undefined, tile); // done(error, tile);
      }
    };

    var callbackKey =
      coords.x.toString() +
      "," +
      coords.y.toString() +
      "," +
      coords.z.toString();
    tileCallbacks[callbackKey] = callback;
    return tile;
  },
});

let tiffTiles: any;

export default function Map() {
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map>();

  useEffect(() => {
    if (!mapElRef.current || mapRef.current) return;

    var map = L.map(mapElRef.current).setView([0, 0], 3);
    mapRef.current = map;
    map.options.minZoom = 10;

    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    tiler.onmessage = function (evt) {
      if (evt.data.tile) {
        var tileReq = evt.data.tile.request;
        var callbackKey =
          tileReq.coords.x.toString() +
          "," +
          tileReq.coords.y.toString() +
          "," +
          tileReq.coords.z.toString();
        tileCallbacks[callbackKey](evt.data.tile.bytes);
        delete tileCallbacks[callbackKey];
      } else if (evt.data.success) {
        if (tiffTiles) {
          tiffTiles.remove();
        }
        tiffTiles = new WorkerTiles();
        var lats: number[] = Array.from(evt.data.bounds[1]);
        var lngs: number[] = Array.from(evt.data.bounds[0]);

        // TODO: Remove globals
        fileStats = evt.data.stats;
        // Zip
        let latLngs = lats.map(function (lat, i, arr) {
          return [lat, lngs[i]];
        }) as LatLngBoundsExpression;
        map.fitBounds(latLngs);
        tiffTiles.addTo(map);
      } else {
        console.log(evt);
      }
    };
  }, [mapElRef]);

  return (
    <>
      <div ref={mapElRef} />
    </>
  );
}
