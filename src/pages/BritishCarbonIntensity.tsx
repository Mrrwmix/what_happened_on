import { Card, Placeholder } from "react-bootstrap";
import { useEffect, useState } from "react";

import type { CarbonIntensityData } from "../services/britishCarbonIntensity";
import { fetchCarbonIntensity } from "../services/britishCarbonIntensity";
import moment from "moment";

interface BritishCarbonIntensityProps {
  selectedDate: string;
  onBack: () => void;
  onReset: () => void;
}

const LoadingIntensity = () => (
  <div className="mb-4 pb-3 border-bottom">
    <h3 className="h5">
      <Placeholder
        as="p"
        animation="glow"
        aria-label="intensity time placeholder"
      >
        <Placeholder xs={8} />
      </Placeholder>
    </h3>
    <Placeholder
      as="p"
      animation="glow"
      className="mb-0"
      aria-label="intensity details placeholder"
    >
      <Placeholder xs={6} /> <Placeholder xs={4} />
      <br />
      <Placeholder xs={7} /> <Placeholder xs={3} />
    </Placeholder>
  </div>
);

const BritishCarbonIntensity = ({
  selectedDate,
  onBack,
  onReset,
}: BritishCarbonIntensityProps) => {
  const [intensityData, setIntensityData] = useState<CarbonIntensityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchCarbonIntensity(selectedDate);
        setIntensityData(data);
      } catch (error) {
        console.error("Error fetching carbon intensity data:", error);
        setError(
          "Failed to load carbon intensity data. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedDate]);

  const getIntensityColor = (index: string) => {
    switch (index) {
      case "very low":
        return "text-success";
      case "low":
        return "text-info";
      case "moderate":
        return "text-warning";
      case "high":
        return "text-danger";
      case "very high":
        return "text-danger fw-bold";
      default:
        return "";
    }
  };

  return (
    <div>
      <h2 className="mb-4">
        GB Carbon Intensity on {moment(selectedDate).format("MMMM D, YYYY")}
      </h2>
      <Card>
        <Card.Body>
          {isLoading ? (
            <>
              <LoadingIntensity />
              <LoadingIntensity />
              <LoadingIntensity />
            </>
          ) : error ? (
            <p className="text-center text-danger">{error}</p>
          ) : intensityData.length === 0 ? (
            <p className="text-center">
              No carbon intensity data available for this date.
            </p>
          ) : (
            intensityData.map((data, index) => (
              <div key={index} className="mb-4 pb-3 border-bottom">
                <h3 className="h5">
                  {moment.utc(data.from).format("HH:mm")} -{" "}
                  {moment.utc(data.to).format("HH:mm")} UTC
                </h3>
                <p className="mb-2">
                  <strong>Forecast:</strong> {data.intensity.forecast} gCO2/kWh
                  {data.intensity.actual && (
                    <span>
                      {" "}
                      | <strong>Actual:</strong> {data.intensity.actual}{" "}
                      gCO2/kWh
                    </span>
                  )}
                </p>
                <p className="mb-2">
                  <strong>Index:</strong>{" "}
                  <span className={getIntensityColor(data.intensity.index)}>
                    {data.intensity.index}
                  </span>
                </p>
                {data.generationmix && data.generationmix.length > 0 && (
                  <div>
                    <strong>Generation Mix:</strong>
                    <div className="row mt-2">
                      {data.generationmix.map((mix) => (
                        <div key={mix.fuel} className="col-md-3 mb-2">
                          <div className="d-flex justify-content-between">
                            <span className="text-capitalize">{mix.fuel}:</span>
                            <span>{mix.perc.toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-center gap-3 mt-4">
        <button className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default BritishCarbonIntensity;
