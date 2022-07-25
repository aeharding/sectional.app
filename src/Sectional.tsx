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

  const [blobs, setBlobs] = useState<Blob[] | null | undefined>();

  useEffect(() => {
    (async function () {
      const b = await Promise.all([
        localforage.getItem<Blob>(`tiff-${label}-s`),
        localforage.getItem<Blob>(`tiff-${label}-m`),
      ]);
      setBlobs((b.filter((i) => i).length ? b : null) as Blob[]);
    })();
  }, [label]);

  return (
    <Link to={`/${sectional}`}>
      {label} ({sectional}){" "}
      {(() => {
        switch (blobs) {
          case undefined:
            return "";
          case null:
            return "❌";
          default:
            return (
              <>
                ✅ <SectionalSize blobs={blobs} />
              </>
            );
        }
      })()}
    </Link>
  );
}
