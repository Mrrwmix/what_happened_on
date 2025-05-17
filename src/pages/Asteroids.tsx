import { Card, Placeholder } from "react-bootstrap";
import { useEffect, useState } from "react";

import type { Asteroid } from "../services/asteroids";
import { fetchAsteroids } from "../services/asteroids";
import moment from "moment";

interface AsteroidsProps {
  selectedDate: string;
}

const LoadingAsteroid = () => (
  <div className="mb-4 pb-3 border-bottom">
    <h3 className="h5">
      <Placeholder
        as="p"
        animation="glow"
        aria-label="asteroid name placeholder"
      >
        <Placeholder xs={6} />
      </Placeholder>
    </h3>
    <Placeholder
      as="p"
      animation="glow"
      className="mb-0"
      aria-label="asteroid details placeholder"
    >
      <Placeholder xs={5} /> <Placeholder xs={3} />
      <br />
      <Placeholder xs={4} /> <Placeholder xs={4} />
      <br />
      <Placeholder xs={3} /> <Placeholder xs={3} />
      <br />
      <Placeholder xs={4} /> <Placeholder xs={2} />
    </Placeholder>
  </div>
);

const Asteroids = ({ selectedDate }: AsteroidsProps) => {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchAsteroids(selectedDate);
        setAsteroids(data);
      } catch (error) {
        console.error("Error fetching NASA data:", error);
        setError("Failed to load asteroid data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedDate]);

  return (
    <div>
      <h2 className="mb-4">
        Near-Earth Objects on {moment(selectedDate).format("MMMM D, YYYY")}
      </h2>
      <Card>
        <Card.Body>
          {isLoading ? (
            <>
              <LoadingAsteroid />
              <LoadingAsteroid />
              <LoadingAsteroid />
            </>
          ) : error ? (
            <p className="text-center text-danger">{error}</p>
          ) : asteroids.length === 0 ? (
            <p className="text-center">
              No asteroid data available for this date.
            </p>
          ) : (
            asteroids.map((asteroid, index) => (
              <div key={index} className="mb-4 pb-3 border-bottom">
                <h3 className="h5">
                  <a
                    href={asteroid.nasa_jpl_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {asteroid.name}
                  </a>
                </h3>
                <p className="mb-0">
                  <strong>Estimated Diameter:</strong>{" "}
                  {Math.round(
                    asteroid.estimated_diameter.meters.estimated_diameter_min
                  )}{" "}
                  -{" "}
                  {Math.round(
                    asteroid.estimated_diameter.meters.estimated_diameter_max
                  )}{" "}
                  meters
                  <br />
                  <strong>Miss Distance:</strong>{" "}
                  {Math.round(
                    parseFloat(
                      asteroid.close_approach_data[0].miss_distance.kilometers
                    )
                  ).toLocaleString()}{" "}
                  km
                  <br />
                  <strong>Velocity:</strong>{" "}
                  {Math.round(
                    parseFloat(
                      asteroid.close_approach_data[0].relative_velocity
                        .kilometers_per_hour
                    )
                  ).toLocaleString()}{" "}
                  km/h
                  <br />
                  <strong>Potentially Hazardous:</strong>{" "}
                  <span
                    className={
                      asteroid.is_potentially_hazardous_asteroid
                        ? "text-danger"
                        : "text-success"
                    }
                  >
                    {asteroid.is_potentially_hazardous_asteroid ? "Yes" : "No"}
                  </span>
                </p>
              </div>
            ))
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Asteroids;
