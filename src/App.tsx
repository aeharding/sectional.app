import React, { useEffect } from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";
import Map from "./Map";
import tiler from "./tiler";
import * as FaaService from "./services/FaaService";

function App() {
  async function extract() {
    const tiffBlob = await FaaService.getSectionalAsTiff(
      FaaService.ChartList.SCHI
    );

    tiler.postMessage({ file: tiffBlob });
  }

  useEffect(() => {
    extract();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Map />
      </header>
    </div>
  );
}

export default App;
