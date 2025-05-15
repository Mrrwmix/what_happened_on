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

// Find the longest suggestion to set the container width
const maxSuggestionLength = Math.max(...dateSuggestions.map((s) => s.length));

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
    <div className="text-center">
      <h1 className="mb-4">
        Enter{" "}
        <span
          className="text-primary suggestion-container"
          style={{
            display: "inline-block",
            width: `${maxSuggestionLength * 0.7}em`, // Approximate width based on character count
            opacity: isTransitioning ? 0 : 1,
            transition: "opacity 0.6s ease-in-out",
            textAlign: "center",
            verticalAlign: "middle",
          }}
        >
          {currentSuggestion}
        </span>
      </h1>

      <Form
        onSubmit={handleSubmit}
        className="d-flex flex-column align-items-center"
      >
        <Form.Group className="mb-3" style={{ maxWidth: "300px" }}>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-center"
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
  );
};

export default DateForm;
