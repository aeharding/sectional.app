// from https://www.faa.gov/air_traffic/flight_info/aeronav/productcatalog/VFRCharts/Sectional/

import { BlobReader, BlobWriter, ZipReader } from "@zip.js/zip.js";
import { XMLParser } from "fast-xml-parser";

import localforage from "localforage";
import { Sectionals } from "./Sectionals";
// @ts-ignore
import loam from "loam";

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
  // create a BlobReader to read with a ZipReader the zip from a Blob object
  const reader = new ZipReader(new BlobReader(zip));

  // get all entries from the zip
  const entries = await reader.getEntries();
  const tif = await entries
    .find(({ filename }) => filename.endsWith(".tif"))
    ?.getData?.(new BlobWriter());

  if (!tif) throw new Error("TIF file not found in zip");

  // close the ZipReader
  await reader.close();

  return tif;
}

loam.initialize("/");

export async function getSectionalAsTiff(
  geoname: Sectionals
): Promise<{ s: Blob; m: Blob }> {
  const cachedSTiffBlob = await localforage.getItem<Blob>(`tiff-${geoname}-s`);
  const cachedMTiffBlob = await localforage.getItem<Blob>(`tiff-${geoname}-m`);
  if (cachedSTiffBlob && cachedMTiffBlob) {
    return { s: cachedSTiffBlob, m: cachedMTiffBlob };
  }

  const sectionalInfo = await getSectionalInfo(geoname);

  const zip = await downloadSectionalZip(sectionalInfo.url);

  console.log("zip size:", zip.size);

  const tiffBlob = await getTiffFromSectionalZip(zip);

  let dataset = await loam.open(tiffBlob);

  const wkt = await dataset.wkt();
  console.log(wkt);

  dataset = await dataset.warp([
    "-s_srs",
    wkt,
    "-t_srs",
    "EPSG:3857",
    "-te_srs",
    "EPSG:4326",
    "-of",
    "GTiff",
  ]);

  const smallDataset = await dataset.convert([
    "-outsize",
    "30%",
    "30%",
    "-r",
    "average",
  ]);
  const mediumDataset = await dataset.convert([
    "-outsize",
    "55%",
    "55%",
    "-r",
    "average",
  ]);

  const reprojectedSTiffBlob = new Blob([await smallDataset.bytes()]);
  const reprojectedMTiffBlob = new Blob([await mediumDataset.bytes()]);
  console.log("got reprojection!", reprojectedSTiffBlob);

  if (!reprojectedSTiffBlob.size) throw new Error("TIF size was 0!");

  await localforage.setItem(`tiff-${geoname}-s`, reprojectedSTiffBlob);
  await localforage.setItem(`tiff-${geoname}-m`, reprojectedMTiffBlob);
  await localforage.setItem(`info-${geoname}`, sectionalInfo);

  return { s: reprojectedSTiffBlob, m: reprojectedMTiffBlob };
}
