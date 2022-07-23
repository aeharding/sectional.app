// unfortunately there's no api for this
export enum Sectionals {
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

// Use the following code to build a map of locations => coordinates
// Will have to rebuild if FAA maps change locations
//
// Need to build with Typescript, then run in console of
// https://nominatim.openstreetmap.org

// (async function () {
//   async function getCoords(location: Sectionals) {
//     const { lat, lon } = await fetch(
//       `https://nominatim.openstreetmap.org/search?q=${location}&format=json`
//     )
//       .then((res) => res.json())
//       .then((places) => places[0] || {});

//     return { lat, lon, location };
//   }
//
//   const vals: any = {};
//
//   for (const v of Object.values(Sectionals)) {
//     const { lat, lon, location } = await getCoords(v);
//     vals[location] = { lat, lon };
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//   }
//   window.vals = vals;
//   console.log("done!");
// })();

const sectionalCoordinates: Record<Sectionals, { lat: string; lon: string }> = {
  Albuquerque: {
    lat: "35.0841034",
    lon: "-106.650985",
  },
  Anchorage: {
    lat: "61.2163129",
    lon: "-149.894852",
  },
  Atlanta: {
    lat: "33.7489924",
    lon: "-84.3902644",
  },
  Bethel: {
    lat: "60.7922222",
    lon: "-161.7558333",
  },
  Billings: {
    lat: "45.7874957",
    lon: "-108.49607",
  },
  Brownsville: {
    lat: "25.9140277",
    lon: "-97.4890879",
  },
  "Cape Lisburne": {
    lat: "68.8811111",
    lon: "-166.21",
  },
  Charlotte: {
    lat: "35.2272086",
    lon: "-80.8430827",
  },
  Cheyenne: {
    lat: "41.139981",
    lon: "-104.820246",
  },
  Chicago: {
    lat: "41.8755616",
    lon: "-87.6244212",
  },
  Cincinnati: {
    lat: "39.1014537",
    lon: "-84.5124602",
  },
  "Cold Bay": {
    lat: "55.199447500000005",
    lon: "-162.74047820061134",
  },
  Dallas: {
    lat: "32.7762719",
    lon: "-96.7968559",
  },
  Dawson: {
    lat: "32.7410762",
    lon: "-101.9576048",
  },
  Denver: {
    lat: "39.7392364",
    lon: "-104.984862",
  },
  Detroit: {
    lat: "42.3315509",
    lon: "-83.0466403",
  },
  "Dutch Harbor": {
    lat: "53.8867533",
    lon: "-166.5418001",
  },
  "El Paso": {
    lat: "31.7865623",
    lon: "-106.441207",
  },
  Fairbanks: {
    lat: "64.837845",
    lon: "-147.716675",
  },
  "Great Falls": {
    lat: "47.5048851",
    lon: "-111.29189",
  },
  "Green Bay": {
    lat: "44.5126379",
    lon: "-88.0125794",
  },
  Halifax: {
    lat: "44.648618",
    lon: "-63.5859487",
  },
  "Hawaiian IS.": {
    lat: "38.2213488",
    lon: "-92.6877354",
  },
  Houston: {
    lat: "29.7589382",
    lon: "-95.3676974",
  },
  Jacksonville: {
    lat: "30.3321838",
    lon: "-81.655651",
  },
  Juneau: {
    lat: "58.3019496",
    lon: "-134.419734",
  },
  "Kansas City": {
    lat: "39.100105",
    lon: "-94.5781416",
  },
  Ketchikan: {
    lat: "55.3430696",
    lon: "-131.6466819",
  },
  Kodiak: {
    lat: "57.79",
    lon: "-152.4072222",
  },
  "Klamath Falls": {
    lat: "42.224867",
    lon: "-121.7816704",
  },
  "Lake Huron": {
    lat: "44.65030755",
    lon: "-82.28186817644615",
  },
  "Las Vegas": {
    lat: "36.1672559",
    lon: "-115.148516",
  },
  "Los Angeles": {
    lat: "34.0536909",
    lon: "-118.242766",
  },
  McGrath: {
    lat: "62.953204",
    lon: "-155.595992",
  },
  Memphis: {
    lat: "35.1335022",
    lon: "-89.9668758",
  },
  Miami: {
    lat: "25.7741728",
    lon: "-80.19362",
  },
  Montreal: {
    lat: "45.5031824",
    lon: "-73.5698065",
  },
  "New Orleans": {
    lat: "29.9759983",
    lon: "-90.0782127",
  },
  "New York": {
    lat: "40.7127281",
    lon: "-74.0060152",
  },
  Nome: {
    lat: "64.4989922",
    lon: "-165.39879944316317",
  },
  Omaha: {
    lat: "41.2587459",
    lon: "-95.9383758",
  },
  Phoenix: {
    lat: "33.4484367",
    lon: "-112.074141",
  },
  "Point Barrow": {
    lat: "71.3865172",
    lon: "-156.4741383",
  },
  "Salt Lake City": {
    lat: "40.7596198",
    lon: "-111.8867975",
  },
  "San Antonio": {
    lat: "29.4246002",
    lon: "-98.4951405",
  },
  "San Francisco": {
    lat: "37.7790262",
    lon: "-122.419906",
  },
  Seattle: {
    lat: "47.6038321",
    lon: "-122.330062",
  },
  Seward: {
    lat: "37.1850331",
    lon: "-100.8928434",
  },
  "St. Louis": {
    lat: "38.6319657",
    lon: "-90.2428756",
  },
  "Twin Cities": {
    lat: "38.2910251",
    lon: "-121.31106",
  },
  Washington: {
    lat: "38.8950368",
    lon: "-77.0365427",
  },
  "West Aleutian Isl": {
    lat: "53.89464775",
    lon: "-166.54029450521597",
  },
  Whitehorse: {
    lat: "60.721571",
    lon: "-135.054932",
  },
  Wichita: {
    lat: "37.6922361",
    lon: "-97.3375448",
  },
};

export function getCoordinatesForSectional(sectional: Sectionals): {
  lat: string;
  lon: string;
} {
  return sectionalCoordinates[sectional];
}
