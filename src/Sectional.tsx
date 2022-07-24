import localforage from "localforage";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionalSize from "./SectionalSize";
import { Sectionals } from "./services/Sectionals";

interface SectionalProps {
  sectional: string;
}

export default function Sectional({ sectional }: SectionalProps) {
  const label = Sectionals[sectional as keyof typeof Sectionals];

  const [blob, setBlob] = useState<Blob | null | undefined>();

  useEffect(() => {
    (async function () {
      setBlob(await localforage.getItem(`tiff-${label}`));
    })();
  }, [label]);

  return (
    <Link to={`/${sectional}`}>
      {label} ({sectional}){" "}
      {(() => {
        switch (blob) {
          case undefined:
            return "";
          case null:
            return "❌";
          default:
            return (
              <>
                ✅ <SectionalSize blob={blob} />
              </>
            );
        }
      })()}
    </Link>
  );
}
