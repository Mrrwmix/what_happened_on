import { Card, Col, Row } from "react-bootstrap";

import moment from "moment";

interface ResultsNavProps {
  onNavigate: (page: string) => void;
  selectedDate: string;
}

const ResultsNav = ({ onNavigate, selectedDate }: ResultsNavProps) => {
  const pages = [
    {
      title: "NY Times Articles",
      description: "View news articles from this date in history",
      id: "nytimes",
    },
    {
      title: "Seismic Activity",
      description: "Explore earthquakes that occurred on this date",
      id: "earthquakes",
    },
    {
      title: "Asteroid Data",
      description: "Learn about near-Earth objects from this date",
      id: "asteroids",
    },
    {
      title: "GB Carbon Intensity",
      description:
        "View Great Britain's electricity carbon intensity data for this date",
      id: "carbon-intensity",
    },
  ];

  const formattedDate = moment(selectedDate).format("MMMM D, YYYY");

  return (
    <>
      <div className="text-center mb-4">
        <h2 className="display-4 mb-0">What Happened On</h2>
        <p className="lead text-primary">{formattedDate}</p>
      </div>
      <Row className="g-4">
        {pages.map((page) => (
          <Col md={4} key={page.id}>
            <Card
              className="h-100 cursor-pointer"
              onClick={() => onNavigate(page.id)}
              role="button"
            >
              <Card.Header as="h5">{page.title}</Card.Header>
              <Card.Body>
                <p className="mb-0">{page.description}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default ResultsNav;
