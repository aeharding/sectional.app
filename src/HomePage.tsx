import { Link } from "react-router-dom";
import { Sectionals } from "./services/Sectionals";

export default function HomePage() {
  return (
    <div>
      <p>All sectionals</p>
      <ol>
        {Object.entries(Sectionals).map(([key, value]) => (
          <li key={key}>
            <Link to={`/${key}`}>
              {value} ({key})
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
