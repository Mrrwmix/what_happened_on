import { Card, Placeholder } from "react-bootstrap";
import { useEffect, useState } from "react";

import type { Earthquake } from "../services/earthquakes";
import { fetchEarthquakes } from "../services/earthquakes";
import moment from "moment";

interface EarthquakesProps {
  selectedDate: string;
}

const LoadingEarthquake = () => (
  <div className="mb-4 pb-3 border-bottom">
    <h3 className="h5">
      <Placeholder
        as="p"
        animation="glow"
        aria-label="earthquake location placeholder"
      >
        <Placeholder xs={8} />
      </Placeholder>
    </h3>
    <Placeholder
      as="p"
      animation="glow"
      className="mb-0"
      aria-label="earthquake details placeholder"
    >
      <Placeholder xs={4} /> <Placeholder xs={2} />
      <br />
      <Placeholder xs={3} /> <Placeholder xs={2} />
    </Placeholder>
  </div>
);

const Earthquakes = ({ selectedDate }: EarthquakesProps) => {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchEarthquakes(selectedDate);
        setEarthquakes(data);
      } catch (error) {
        console.error("Error fetching USGS data:", error);
        setError("Failed to load earthquake data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedDate]);

  return (
    <div>
      <h2 className="mb-4">
        Seismic Activity on {moment(selectedDate).format("MMMM D, YYYY")}
      </h2>
      <Card>
        <Card.Body>
          {isLoading ? (
            <>
              <LoadingEarthquake />
              <LoadingEarthquake />
              <LoadingEarthquake />
            </>
          ) : error ? (
            <p className="text-center text-danger">{error}</p>
          ) : earthquakes.length === 0 ? (
            <p className="text-center">
              No significant earthquakes recorded on this date.
            </p>
          ) : (
            earthquakes.map((quake, index) => (
              <div key={index} className="mb-4 pb-3 border-bottom">
                <h3 className="h5">
                  <a
                    href={quake.properties.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {quake.properties.place}
                  </a>
                </h3>
                <p className="mb-0">
                  <strong>Magnitude:</strong> {quake.properties.mag}
                  <br />
                  <strong>Time:</strong>{" "}
                  {moment(quake.properties.time).format("HH:mm:ss")}
                </p>
              </div>
            ))
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Earthquakes;
