// from https://www.faa.gov/air_traffic/flight_info/aeronav/productcatalog/VFRCharts/Sectional/

import { XMLParser } from "fast-xml-parser";

// @ts-ignore
import { Reader } from "@transcend-io/conflux";
import localforage from "localforage";

// unfortunately there's no api for this
export enum ChartList {
  SALB = "Albuquerque",
  SANC = "Anchorage",
  SATL = "Atlanta",
  SBET = "Bethel",
  SBIL = "Billings",
  SBRO = "Brownsville",
  SCAP = "Cape Lisburne",
  SCHA = "Charlotte",
  SCHE = "Cheyenne",
  SCHI = "Chicago",
  SCIN = "Cincinnati",
  SCB = "Cold Bay",
  SDAL = "Dallas",
  SDAW = "Dawson",
  SDEN = "Denver",
  SDET = "Detroit",
  SDUT = "Dutch Harbor",
  SELP = "El Paso",
  SFAI = "Fairbanks",
  SGF = "Great Falls",
  SGB = "Green Bay",
  SHAL = "Halifax",
  SHI = "Hawaiian IS.",
  SHOU = "Houston",
  SJAC = "Jacksonville",
  SJUN = "Juneau",
  SKC = "Kansas City",
  SKET = "Ketchikan",
  SKOD = "Kodiak",
  SKF = "Klamath Falls",
  SLH = "Lake Huron",
  SLV = "Las Vegas",
  SLA = "Los Angeles",
  SMCG = "McGrath",
  SMEM = "Memphis",
  SMIA = "Miami",
  SMON = "Montreal",
  SNO = "New Orleans",
  SNY = "New York",
  SNOM = "Nome",
  SOMA = "Omaha",
  SPHX = "Phoenix",
  SPB = "Point Barrow",
  SSLC = "Salt Lake City",
  SSA = "San Antonio",
  SSF = "San Francisco",
  SSEA = "Seattle",
  SSEW = "Seward",
  SSTL = "St. Louis",
  STC = "Twin Cities",
  SWAS = "Washington",
  SWAL = "West Aleutian Isl",
  SWHI = "Whitehorse",
  SWIC = "Wichita",
}

interface SectionalInfo {
  url: string;
  name: string;
  edition: number;
  date: string;
}

export async function getSectionalInfo(
  geoname: ChartList
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

export async function getSectionalAsTiff(geoname: ChartList): Promise<Blob> {
  const cachedTiffBlob = await localforage.getItem<Blob>(`tiff-${geoname}`);
  if (cachedTiffBlob) return cachedTiffBlob;

  const sectionalInfo = await getSectionalInfo(ChartList.SCHI);

  const zip = await downloadSectionalZip(sectionalInfo.url);

  const tiffBlob = await getTiffFromSectionalZip(zip);

  await localforage.setItem(`tiff-${geoname}`, tiffBlob);
  await localforage.setItem(`info-${geoname}`, sectionalInfo);

  return tiffBlob;
}
