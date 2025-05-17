import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Asteroids from "./pages/Asteroids";
import BritishCarbonIntensity from "./pages/BritishCarbonIntensity";
import DateForm from "./components/DateForm";
import Earthquakes from "./pages/Earthquakes";
import NYTimes from "./pages/NYTimes";
import NavBar from "./components/NavBar";
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
    if (page === "form") {
      setSelectedDate("");
    }
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
        return <ResultsNav onNavigate={handleNavigate} />;
      case "nytimes":
        return <NYTimes selectedDate={selectedDate} />;
      case "earthquakes":
        return <Earthquakes selectedDate={selectedDate} />;
      case "asteroids":
        return <Asteroids selectedDate={selectedDate} />;
      case "carbon-intensity":
        return <BritishCarbonIntensity selectedDate={selectedDate} />;
      default:
        return <DateForm onSubmit={handleDateSubmit} />;
    }
  };

  const showNavigation = currentPage !== "form";
  const showBack = currentPage !== "form" && currentPage !== "nav";

  return (
    <>
      <NavBar
        showBack={showBack}
        showReset={showNavigation}
        onBack={handleBack}
        onReset={handleReset}
      />
      <div className="container py-3 w-100 h-100">{renderPage()}</div>
    </>
  );
}

export default App;
