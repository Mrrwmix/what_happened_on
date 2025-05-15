import { Card, Placeholder } from "react-bootstrap";
import { useEffect, useState } from "react";

import type { Article } from "../services/nytimes";
import { fetchArticles } from "../services/nytimes";
import moment from "moment";

interface NYTimesProps {
  selectedDate: string;
  onBack: () => void;
  onReset: () => void;
}

const LoadingArticle = () => (
  <div className="mb-4 pb-3 border-bottom">
    <h3 className="h5">
      <Placeholder
        as="p"
        animation="glow"
        aria-label="article title placeholder"
      >
        <Placeholder xs={10} />
      </Placeholder>
    </h3>
    <Placeholder
      as="p"
      animation="glow"
      className="mb-0"
      aria-label="article abstract placeholder"
    >
      <Placeholder xs={8} />
      <Placeholder xs={6} />
    </Placeholder>
  </div>
);

const NYTimes = ({ selectedDate, onBack, onReset }: NYTimesProps) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchArticles(selectedDate);
        setArticles(data);
      } catch (error) {
        console.error("Error fetching NY Times data:", error);
        setError("Failed to load articles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedDate]);

  return (
    <div>
      <h2 className="mb-4">
        NY Times Articles from {moment(selectedDate).format("MMMM D, YYYY")}
      </h2>
      <Card>
        <Card.Body>
          {isLoading ? (
            <>
              <LoadingArticle />
              <LoadingArticle />
              <LoadingArticle />
            </>
          ) : error ? (
            <p className="text-center text-danger">{error}</p>
          ) : articles.length === 0 ? (
            <p className="text-center">No articles found for this date.</p>
          ) : (
            articles.map((article, index) => (
              <div key={index} className="mb-4 pb-3 border-bottom">
                <h3 className="h5">
                  <a
                    href={article.web_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {article.headline.main}
                  </a>
                </h3>
                <p className="text-muted mb-0">{article.abstract}</p>
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

export default NYTimes;
