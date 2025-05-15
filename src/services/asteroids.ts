import moment from "moment";

export interface Asteroid {
  name: string;
  estimated_diameter: {
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    miss_distance: {
      kilometers: string;
    };
    relative_velocity: {
      kilometers_per_hour: string;
    };
  }>;
  nasa_jpl_url: string;
}

export interface NASAResponse {
  near_earth_objects: {
    [key: string]: Asteroid[];
  };
}

const NASA_API_KEY = "nzDTlixflJIZcchogN9lZyKGc6qW2V0ElS9qHvAD";

export async function fetchAsteroids(date: string): Promise<Asteroid[]> {
  if (!moment(date, "YYYY-MM-DD", true).isValid()) {
    throw new Error("Invalid date format. Please use YYYY-MM-DD");
  }

  const formattedDate = moment(date, "YYYY-MM-DD").format("YYYY-MM-DD");
  const response = await fetch(
    `https://api.nasa.gov/neo/rest/v1/feed?start_date=${formattedDate}&end_date=${formattedDate}&api_key=${NASA_API_KEY}`
  );

  if (!response.ok) {
    throw new Error(`NASA API returned ${response.status}`);
  }

  const data = (await response.json()) as NASAResponse;
  return Object.values(data.near_earth_objects)[0];
}
