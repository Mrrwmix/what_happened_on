import moment from "moment";

export interface Earthquake {
  properties: {
    place: string;
    mag: number;
    time: number;
    url: string;
  };
}

export interface USGSResponse {
  features: Earthquake[];
}

export async function fetchEarthquakes(date: string): Promise<Earthquake[]> {
  if (!moment(date, "YYYY-MM-DD", true).isValid()) {
    throw new Error("Invalid date format. Please use YYYY-MM-DD");
  }

  const startTime = moment(date, "YYYY-MM-DD").startOf("day").toISOString();
  const endTime = moment(date, "YYYY-MM-DD").endOf("day").toISOString();

  const response = await fetch(
    `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&endtime=${endTime}&minmagnitude=4`
  );

  if (!response.ok) {
    throw new Error(`USGS API returned ${response.status}`);
  }

  const data = (await response.json()) as USGSResponse;
  return data.features;
}
