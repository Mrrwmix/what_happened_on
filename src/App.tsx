import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Asteroids from "./pages/Asteroids";
import BritishCarbonIntensity from "./pages/BritishCarbonIntensity";
import DateForm from "./components/DateForm";
import Earthquakes from "./pages/Earthquakes";
import NYTimes from "./pages/NYTimes";
import ResultsNav from "./components/ResultsNav";
import { useState } from "react";

function App() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<string>("form");

  const handleDateSubmit = (date: string) => {
    setSelectedDate(date);
    setCurrentPage("nav");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage("nav");
  };

  const handleReset = () => {
    setSelectedDate("");
    setCurrentPage("form");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "form":
        return <DateForm onSubmit={handleDateSubmit} />;
      case "nav":
        return <ResultsNav onNavigate={handleNavigate} onReset={handleReset} />;
      case "nytimes":
        return (
          <NYTimes
            selectedDate={selectedDate}
            onBack={handleBack}
            onReset={handleReset}
          />
        );
      case "earthquakes":
        return (
          <Earthquakes
            selectedDate={selectedDate}
            onBack={handleBack}
            onReset={handleReset}
          />
        );
      case "asteroids":
        return (
          <Asteroids
            selectedDate={selectedDate}
            onBack={handleBack}
            onReset={handleReset}
          />
        );
      case "carbon-intensity":
        return (
          <BritishCarbonIntensity
            selectedDate={selectedDate}
            onBack={handleBack}
            onReset={handleReset}
          />
        );
      default:
        return <DateForm onSubmit={handleDateSubmit} />;
    }
  };

  return <div className="container py-5 w-100 h-100">{renderPage()}</div>;
}

export default App;
