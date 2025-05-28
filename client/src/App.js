import React, { useState } from "react";
// import AirportSearch from './components/AirportSearch'; // adjust path
import FlightSearch from "./pages/FlightSearch";
import FlightResults from './components/FlightResults';

function App() {
  
  const [flights, setFlights] = useState([]);

  const onSearch = async (query) => {
    try {
      const params = new URLSearchParams(query).toString();
      const response = await fetch(
        `http://localhost:5000/api/flight-search?${params}`
      );
      const data = await response.json();
      setFlights(data.data || []);      
    } catch (error) {
      console.error("❌ Error fetching flights:", error);
    }
  };

  return (
    <div>
      <FlightSearch onSearch={onSearch} />
      
      {/* Render Results below */}
      {flights.length > 0 && <FlightResults flights={flights} />}
    </div>
  );
}

export default App;
