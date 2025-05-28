import React, { useState } from "react";
import AirportAutocomplete from "../components/AirportAutocomplete"; // Assumes you already have this

const FlightSearchForm = ({ onSearch }) => {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [travelClass, setTravelClass] = useState("");
  const [includedAirlineCodes, setIncludedAirlineCodes] = useState("");
  const [excludedAirlineCodes, setExcludedAirlineCodes] = useState("");
  const [nonStop, setNonStop] = useState();
  const [currencyCode, setCurrencyCode] = useState("INR");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!from || !to || !departureDate || !adults) return;

    // const query = {
    //   originLocationCode: from.iataCode,
    //   destinationLocationCode: to.iataCode,
    //   departureDate,
    //   returnDate: returnDate || undefined,
    //   adults,
    //   children,
    //   infants,
    //   travelClass,
    //   includedAirlineCodes: includedAirlineCodes || undefined,
    //   excludedAirlineCodes: excludedAirlineCodes || undefined,
    //   nonStop,
    //   currencyCode,
    //   maxPrice: maxPrice || undefined,
    //   max: maxResults,
    // };
    const query = {
      originLocationCode: from.iataCode,
      destinationLocationCode: to.iataCode,
      departureDate,
      ...(returnDate ? { returnDate } : {}),
      adults,
      ...(children > 0 ? { children } : {}),
      ...(infants > 0 ? { infants } : {}),
      ...(travelClass ? { travelClass } : {}),
      ...(includedAirlineCodes ? { includedAirlineCodes } : {}),
      ...(excludedAirlineCodes ? { excludedAirlineCodes } : {}),
      ...(nonStop ? { nonStop } : {}),
      currencyCode,
      ...(maxPrice ? { maxPrice } : {}),
      max: 50,
    };

    onSearch(query); // Send the query object to parent or API
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      <AirportAutocomplete label="From" onSelect={setFrom} />
      <AirportAutocomplete label="To" onSelect={setTo} />

      <div className="flex gap-4">
        <div>
          <label>Departure Date</label>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Return Date (optional)</label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <input
          type="number"
          value={adults}
          onChange={(e) => setAdults(Number(e.target.value))}
          min={1}
          max={9}
          placeholder="Adults"
          required
        />
        <input
          type="number"
          value={children}
          onChange={(e) => setChildren(Number(e.target.value))}
          min={0}
          max={9 - adults}
          placeholder="Children"
        />
        <input
          type="number"
          value={infants}
          onChange={(e) => setInfants(Number(e.target.value))}
          min={0}
          max={adults}
          placeholder="Infants"
        />
      </div>

      <select
        value={travelClass}
        onChange={(e) => setTravelClass(e.target.value)}
      >
        <option value="">All</option>
        <option value="ECONOMY">Economy</option>
        <option value="PREMIUM_ECONOMY">Premium Economy</option>
        <option value="BUSINESS">Business</option>
        <option value="FIRST">First Class</option>
      </select>

      <input
        type="text"
        value={includedAirlineCodes}
        onChange={(e) => setIncludedAirlineCodes(e.target.value)}
        placeholder="Included Airlines (e.g. AI,6E)"
      />
      <input
        type="text"
        value={excludedAirlineCodes}
        onChange={(e) => setExcludedAirlineCodes(e.target.value)}
        placeholder="Excluded Airlines (e.g. BA,LH)"
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={nonStop}
          onChange={(e) => setNonStop(e.target.checked)}
        />
        <label>Non-stop only</label>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          value={currencyCode}
          onChange={(e) => setCurrencyCode(e.target.value)}
          placeholder="Currency Code (e.g. INR)"
        />
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max Price"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded"
      >
        Search Flights
      </button>
    </form>
  );
};

export default FlightSearchForm;
