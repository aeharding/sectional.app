import React, { useState } from "react";
import "./App.css";
// @ts-ignore
import { Reader } from "@transcend-io/conflux";
import "leaflet/dist/leaflet.css";
import Map from "./Map";
import tiler from "./tiler";

function App() {
  async function extract() {
    const zip = await fetch(
      "/api/aeronav/visual/07-14-2022/sectional-files/Chicago.zip"
    ).then((res) => res.blob());

    console.log(zip);

    let entry = undefined;

    for await (const _entry of Reader(zip)) {
      if (_entry.name.endsWith(".tif")) {
        entry = _entry;
        break;
      }
    }

    // I don't understand why logging here makes this work lmao
    console.log(entry, entry.arrayBuffer());

    const arrayBuffer = await entry.arrayBuffer();

    tiler.postMessage({ file: new Blob([arrayBuffer]) });

    // var img = document.getElementById("image");
    // img.src = "data:image/png;base64," + encode(await image.readRasters());
  }

  return (
    <div className="App">
      <header className="App-header">
        <p onClick={extract}>Download and extract chart</p>
        <Map />
      </header>
    </div>
  );
}

export default App;
