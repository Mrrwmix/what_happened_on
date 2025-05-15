const API_BASE_URL = "https://api.carbonintensity.org.uk";

export interface CarbonIntensityData {
  from: string;
  to: string;
  intensity: {
    forecast: number;
    actual?: number;
    index: "very low" | "low" | "moderate" | "high" | "very high";
  };
  generationmix: Array<{
    fuel: string;
    perc: number;
  }>;
}

export interface CarbonIntensityResponse {
  data: CarbonIntensityData[];
}

export async function fetchCarbonIntensity(
  date: string
): Promise<CarbonIntensityData[]> {
  // Format date to YYYY-MM-DD
  const formattedDate = date;

  const response = await fetch(
    `${API_BASE_URL}/intensity/date/${formattedDate}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Carbon Intensity API returned ${response.status}`);
  }

  const data = (await response.json()) as CarbonIntensityResponse;

  // Check if the response has the expected structure
  if (!data.data || !Array.isArray(data.data)) {
    console.error("Unexpected API response structure:", data);
    return [];
  }

  // Sort data chronologically by 'from' timestamp (00:00 to 23:30)
  // Extract time part for comparison since we know it's all the same date
  return [...data.data].sort((a, b) => {
    const timeA = a.from.split("T")[1].replace("Z", "");
    const timeB = b.from.split("T")[1].replace("Z", "");
    return timeA.localeCompare(timeB);
  });
}
