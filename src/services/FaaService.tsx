// from https://www.faa.gov/air_traffic/flight_info/aeronav/productcatalog/VFRCharts/Sectional/

import { XMLParser } from "fast-xml-parser";

// @ts-ignore
import { Reader } from "@transcend-io/conflux";
import localforage from "localforage";
import { Sectionals } from "./Sectionals";

interface SectionalInfo {
  url: string;
  name: string;
  edition: number;
  date: string;
}

export async function getSectionalInfo(
  geoname: Sectionals
): Promise<SectionalInfo> {
  const data = await fetch(
    `/api/apra/vfr/sectional/chart?${new URLSearchParams({
      geoname,
      edition: "current",
      format: "tiff",
    })}`
  );

  const xml = await data.text();

  const parser = new XMLParser({ ignoreAttributes: false });
  let jsonObj = parser.parse(xml);

  return {
    url: jsonObj.productSet.edition.product["@_url"],
    name: jsonObj.productSet.edition["@_geoname"],
    edition: jsonObj.productSet.edition.editionNumber,
    date: jsonObj.productSet.edition.editionDate,
  };
}

export async function downloadSectionalZip(faaUrl: string): Promise<Blob> {
  const data = await fetch(`/api/aeronav${new URL(faaUrl).pathname}`);

  return await data.blob();
}

export async function getTiffFromSectionalZip(zip: Blob): Promise<Blob> {
  let entry = undefined;

  for await (const _entry of Reader(zip)) {
    if (_entry.name.endsWith(".tif")) {
      entry = _entry;
      break;
    }
  }

  const arrayBuffer = await entry.arrayBuffer();

  return new Blob([arrayBuffer]);
}

export async function getSectionalAsTiff(geoname: Sectionals): Promise<Blob> {
  const cachedTiffBlob = await localforage.getItem<Blob>(`tiff-${geoname}`);
  if (cachedTiffBlob) return cachedTiffBlob;

  const sectionalInfo = await getSectionalInfo(geoname);

  const zip = await downloadSectionalZip(sectionalInfo.url);

  const tiffBlob = await getTiffFromSectionalZip(zip);

  await localforage.setItem(`tiff-${geoname}`, tiffBlob);
  await localforage.setItem(`info-${geoname}`, sectionalInfo);

  return tiffBlob;
}
