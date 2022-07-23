import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { faLocationArrow } from "@fortawesome/pro-light-svg-icons";
import { faLocationArrow as faLocationArrowSolid } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import useGeolocation from "../../hooks/useGeolocation";

const LocationIcon = styled(FontAwesomeIcon, {
  shouldForwardProp: (prop) => prop !== "tracking",
})<{ tracking: boolean }>`
  ${({ tracking }) =>
    tracking &&
    css`
      color: #2a93ee;
    `}
`;

interface LocationProps {
  map: React.MutableRefObject<L.Map | undefined>;
}

export default function Location({ map }: LocationProps) {
  const [tracking, setTracking] = useState(false);
  const geolocation = useGeolocation({
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 5000,
  });
  function onClick() {
    if (!geolocation.latitude || !geolocation.longitude) return;

    map.current?.flyTo({
      lat: geolocation.latitude,
      lng: geolocation.longitude,
    });
    setTracking(true);
  }

  useEffect(() => {
    if (!map) return;

    const onMove = () => {
      setTracking(false);
    };

    map.current?.on("movestart", onMove);

    const mapRef = map.current;

    return () => {
      mapRef?.off("movestart", onMove);
    };
  }, [map]);

  return (
    <LocationIcon
      icon={tracking ? faLocationArrowSolid : faLocationArrow}
      onClick={onClick}
      tracking={tracking}
    />
  );
}
