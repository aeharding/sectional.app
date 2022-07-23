import styled from "@emotion/styled";
import Location from "./map/controls/Location";

const Container = styled.div`
  background: white;

  position: absolute;
  left: max(env(safe-area-inset-left, 1em), 1em);
  bottom: max(env(safe-area-inset-bottom, 1em), 1em);

  border-radius: 5px;

  padding: 0.5em;

  font-size: 1.1em;

  z-index: 500;
`;

interface ControlsProps {
  map: React.MutableRefObject<L.Map | undefined>;
}

export default function Controls({ map }: ControlsProps) {
  return (
    <Container>
      <Location map={map} />
    </Container>
  );
}
