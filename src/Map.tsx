import L, { Coords, DoneCallback, LatLngBoundsExpression } from "leaflet";
import { useEffect, useRef } from "react";
import Controls from "./Controls";
import { getCoordinatesForSectional, Sectionals } from "./services/Sectionals";
import tiler from "./tiler";

export const MIN_ZOOM = 7;

let tileCallbacks: any = {};

// Calculated min/max/nodata for the file, used for each tile request
let fileStats: any;

var myLocationIcon = L.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" version="1.1" viewBox="-16 -16 32 32"><circle r="16" style="fill:#fff;fill-opacity:1;opacity:1;"></circle><circle r="16" style="fill:#2A93EE;fill-opacity:1;opacity:1;"></circle></svg>',
  className: "leaflet-control-locate-location",
  iconSize: [20, 20],
});

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

    // If you hold a pinch on a touch device it will
    // trigger the worker which slows stuff down, so bail
    if (coords.z < MIN_ZOOM) {
      done();
      return;
    }

    var tile = document.createElement("img");
    (coords.z < 10 ? tiler.s : tiler.m).postMessage({
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
        done();
      } else {
        var outputBlob = new Blob([bytes], { type: "image/png" });
        var imageURL = window.URL.createObjectURL(outputBlob);
        tile.src = imageURL;
        tile.onload = () => {
          URL.revokeObjectURL(imageURL);
        };
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

interface MapProps {
  sectional: Sectionals;
}

export default function Map({ sectional }: MapProps) {
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map>();
  const marker = useRef<L.Marker>();
  const geolocationWatcher = useRef<number>();

  useEffect(() => {
    if (!mapElRef.current || mapRef.current) return;

    const coords = getCoordinatesForSectional(sectional);

    var map = L.map(mapElRef.current, {
      minZoom: MIN_ZOOM,
      maxZoom: 13,
      attributionControl: false,
      zoomSnap: window.matchMedia("(hover:none)").matches ? 0 : 1,
      zoomControl: !window.matchMedia("(hover:none)").matches,
    })
      .setView([+coords.lat, +coords.lon], 3)
      .locate({ setView: true, maxZoom: 10 });

    mapRef.current = map;

    L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    [tiler.s, tiler.m].forEach(
      (tilerSize) =>
        (tilerSize.onmessage = function (evt) {
          if (evt.data === "failed") {
            // There was a problem with the cached data. Need to clear and retry
            // TODO just clear bad data
            // localforage.clear();
            // TODO show error to the user, ask to restart
          }
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
            // map.fitBounds(latLngs);
            map.setMaxBounds(latLngs);
            tiffTiles.addTo(map);
          } else {
            console.log(evt);
          }
        })
    );
  }, [mapElRef, sectional]);

  useEffect(() => {
    if (!marker.current && mapRef.current)
      marker.current = L.marker([0, 0], {
        icon: myLocationIcon,
      })
        .bindPopup("Current position")
        .addTo(mapRef.current);

    geolocationWatcher.current = navigator.geolocation.watchPosition(
      ({ coords }) =>
        marker.current?.setLatLng({
          lat: coords.latitude,
          lng: coords.longitude,
        }),
      undefined,
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => {
      typeof geolocationWatcher.current === "number" &&
        navigator.geolocation.clearWatch(geolocationWatcher.current);
    };
  });

  return (
    <>
      <div ref={mapElRef} />

      <Controls map={mapRef} />
    </>
  );
}
