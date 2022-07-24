import { getDistance } from "geolib";
import { useMemo } from "react";
import useGeolocation from "./hooks/useGeolocation";
import Sectional from "./Sectional";
import { getCoordinatesForSectional, Sectionals } from "./services/Sectionals";

export default function HomePage() {
  const geolocation = useGeolocation();

  const nearest = useMemo(() => {
    if (!geolocation.latitude || !geolocation.longitude) return undefined;

    return Object.entries(Sectionals)
      .map(([key, value]) => ({
        key,
        value,
        distance: getDistance(
          {
            latitude: geolocation.latitude!,
            longitude: geolocation.longitude!,
          },
          getCoordinatesForSectional(value)
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  }, [geolocation]);

  return (
    <div>
      {nearest ? (
        <>
          <p>Close to you</p>
          <ol>
            {nearest.map(({ key, value, distance }) => (
              <li key={key}>
                <Sectional sectional={key} />
              </li>
            ))}
          </ol>
        </>
      ) : (
        ""
      )}

      <p>All sectionals</p>
      <ol>
        {Object.entries(Sectionals).map(([key, value]) => (
          <li key={key}>
            <Sectional sectional={key} />
          </li>
        ))}
      </ol>
    </div>
  );
}
