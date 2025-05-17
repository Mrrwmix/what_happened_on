import { Alert, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

interface DateFormProps {
  onSubmit: (date: string) => void;
}

const dateSuggestions = [
  "your birthday",
  "your mother's birthday",
  "your father's birthday",
  "your anniversary",
  "your graduation day",
  "the date of your first baseball game",
  "your first day of school",
  "your favorite holiday",
  "a historic event",
  "your best friend's birthday",
];

const DateForm = ({ onSubmit }: DateFormProps) => {
  const [date, setDate] = useState("");
  const [error, setError] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(
    dateSuggestions[0]
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      // Wait for fade out
      setTimeout(() => {
        setCurrentSuggestion((prev) => {
          const currentIndex = dateSuggestions.indexOf(prev);
          const nextIndex = (currentIndex + 1) % dateSuggestions.length;
          return dateSuggestions[nextIndex];
        });
        // Start fade in
        setIsTransitioning(false);
      }, 300); // Half of the transition duration
    }, 4000); // Change every 4 seconds (increased to account for transition)

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setError(true);
      return;
    }
    setError(false);
    onSubmit(date);
  };

  return (
    <div className="container justify-content-center align-items-center">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 text-center">
          <h1 className="mb-4 d-flex flex-column align-items-center">
            <span className="mb-2">Enter</span>
            <span
              className="text-primary px-3"
              style={{
                opacity: isTransitioning ? 0 : 1,
                transition: "opacity 0.6s ease-in-out",
              }}
            >
              {currentSuggestion}
            </span>
          </h1>
        </div>
      </div>
      <div className="row justify-content-center">
        <Form
          className="col-12 d-flex flex-column align-items-center"
          onSubmit={handleSubmit}
        >
          <Form.Group className="mb-3">
            <Form.Label className="visually-hidden">Date</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-center mx-auto"
              style={{ maxWidth: "300px" }}
              aria-label="Date"
            />
          </Form.Group>

          {error && (
            <Alert variant="danger" className="mb-3">
              Please Enter A Valid Date
            </Alert>
          )}

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default DateForm;
