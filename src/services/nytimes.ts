import moment from "moment";

export interface Article {
  headline: { main: string };
  web_url: string;
  abstract: string;
}

export interface NYTimesResponse {
  response: {
    docs: Article[];
  };
  status: string;
  copyright: string;
}

const NYT_API_KEY = "R1a31F4tBjCUaM2ho8GtIFsrSdtXt30M";

export async function fetchArticles(date: string): Promise<Article[]> {
  if (!moment(date, "YYYY-MM-DD", true).isValid()) {
    throw new Error("Invalid date format. Please use YYYY-MM-DD");
  }

  const formattedDate = moment(date, "YYYY-MM-DD").format("YYYYMMDD");

  const response = await fetch(
    `https://api.nytimes.com/svc/search/v2/articlesearch.json?&fq=firstPublished=${formattedDate}&api-key=${NYT_API_KEY}`
  );

  if (!response.ok) {
    throw new Error(`NY Times API returned ${response.status}`);
  }

  const data = (await response.json()) as NYTimesResponse;

  // Check if the response has the expected structure
  if (!data.response || !Array.isArray(data.response.docs)) {
    console.error("Unexpected API response structure:", data);
    return [];
  }

  return data.response.docs.slice(0, 5);
}
