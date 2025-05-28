import React, { useState } from 'react';
import AirportAutocomplete from './AirportAutocomplete'; // adjust path if needed

function AirportSearch() {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  return (
    <div style={{ maxWidth: 400, margin: '30px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Flight Search</h2>
      <AirportAutocomplete label="From" onSelect={setFrom} />
      <AirportAutocomplete label="To" onSelect={setTo} />

      <div style={{ marginTop: 20 }}>
        <h4>Selected Airports</h4>
        <p><strong>From:</strong> {from ? `${from.name} (${from.iataCode})` : 'Not selected'}</p>
        <p><strong>To:</strong> {to ? `${to.name} (${to.iataCode})` : 'Not selected'}</p>
      </div>
    </div>
  );
}


export default AirportSearch;
//   const [keyword, setKeyword] = useState('');
//   const [airports, setAirports] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Fetch airports whenever keyword changes (with debounce)
//   useEffect(() => {
//     if (!keyword) {
//       setAirports([]);
//       setError(null);
//       return;
//     }

//     const delayDebounce = setTimeout(() => {
//       fetchAirports(keyword);
//     }, 500); // debounce 500ms

//     return () => clearTimeout(delayDebounce);
//   }, [keyword]);

//   async function fetchAirports(searchKeyword) {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`http://localhost:5000/api/airports?keyword=${encodeURIComponent(searchKeyword)}`);
//       const data = await response.json();

//       if (Array.isArray(data)) {
//         setAirports(data);
//         setError(null);
//       } else if (data.errors) {
//         setError(data.errors[0]?.detail || 'API error occurred');
//         setAirports([]);
//       } else {
//         setError('Unexpected response from server');
//         setAirports([]);
//       }
//     } catch (err) {
//       setError('Network or server error');
//       setAirports([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
//       <h2>Airport Search</h2>
//       <input
//         type="text"
//         placeholder="Enter city or airport keyword"
//         value={keyword}
//         onChange={(e) => setKeyword(e.target.value)}
//         style={{ width: '100%', padding: '10px', fontSize: '16px' }}
//       />

//       {loading && <p>Loading...</p>}

//       {error && <p style={{ color: 'red' }}>Error: {error}</p>}

//       {!loading && !error && airports.length === 0 && keyword !== '' && (
//         <p>No airports found</p>
//       )}

//       <ul>
//         {!error && airports.map((airport) => (
//           <li key={airport.id}>
//             <strong>{airport.name}</strong> ({airport.iataCode}) - {airport.address?.cityName}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
  