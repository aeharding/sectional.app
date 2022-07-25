import React, { useEffect, useRef } from "react";
import Map from "./Map";
import tiler from "./tiler";
import * as FaaService from "./services/FaaService";
import { Sectionals } from "./services/Sectionals";
import { useParams } from "react-router";

export default function SectionalPage() {
  const { sectionalId } = useParams();
  const selectedSectional = sectionalId
    ? Sectionals[sectionalId as unknown as keyof typeof Sectionals]
    : undefined;
  const currentSectional = useRef<string | undefined>();

  async function extract() {
    if (!selectedSectional) return;

    const tiffBlob = await FaaService.getSectionalAsTiff(selectedSectional);

    tiler.s.postMessage({ file: tiffBlob.s });
    tiler.m.postMessage({ file: tiffBlob.m });
  }

  useEffect(() => {
    if (currentSectional.current === selectedSectional) return;

    currentSectional.current = selectedSectional;
    extract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSectional]);

  if (!selectedSectional) return <>Not found</>;

  return <Map sectional={selectedSectional} />;
}
