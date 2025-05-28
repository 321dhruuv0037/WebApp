import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AirportAutocomplete = ({ label, onSelect }) => {
  const [query, setQuery] = useState('');
  const [airports, setAirports] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [suppressSearch, setSuppressSearch] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchAirports = async () => {
      if (!query || query.length < 2 || suppressSearch) {
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/airports?keyword=${query}`);
        setAirports(res.data);
        setIsDropdownVisible(true);
      } catch (err) {
        console.error('Error fetching airports:', err);
        setAirports([]);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchAirports();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, suppressSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (airport) => {
    const formatted = `${airport.name} (${airport.iataCode})`;
    setQuery(formatted);
    setAirports([]);
    setIsDropdownVisible(false);
    setSuppressSearch(true); // Prevent fetch after selection
    onSelect(airport);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    setSuppressSearch(false); // Allow fetch when user types again
    setIsDropdownVisible(true);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', marginBottom: '1rem' }}>
      <label>{label}</label>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Type airport name or code"
        style={{
          width: '100%',
          padding: '8px',
          boxSizing: 'border-box',
        }}
      />
      {isDropdownVisible && airports.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            border: '1px solid #ccc',
            position: 'absolute',
            width: '100%',
            background: '#fff',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 999,
          }}
        >
          {airports.map((airport) => (
            <li
              key={airport.id}
              onClick={() => handleSelect(airport)}
              style={{
                padding: '8px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
              }}
            >
              {airport.name} ({airport.iataCode}) - {airport.address?.cityName || 'Unknown City'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AirportAutocomplete;



// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';

// const AirportAutocomplete = ({ label, onSelect }) => {
//   const [query, setQuery] = useState('');
//   const [airports, setAirports] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [highlightedIndex, setHighlightedIndex] = useState(-1);
//   const containerRef = useRef(null);

//   useEffect(() => {
//     if (query.length < 3) {
//       setAirports([]);
//       setShowDropdown(false);
//       return;
//     }

//     const fetchAirports = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/airports?keyword=${encodeURIComponent(query)}`);
//         setAirports(res.data);
//         setShowDropdown(true);
//         setHighlightedIndex(-1);
//       } catch (error) {
//         console.error('Error fetching airports:', error);
//         setAirports([]);
//         setShowDropdown(false);
//       }
//     };

//     const debounceTimeout = setTimeout(fetchAirports, 300);

//     return () => clearTimeout(debounceTimeout);
//   }, [query]);

//   // Close dropdown if clicked outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (containerRef.current && !containerRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleSelect = (airport) => {
//     setQuery(`${airport.name} (${airport.iataCode})`);
//     setShowDropdown(false);
//     onSelect(airport);
//   };

//   const handleKeyDown = (e) => {
//     if (!showDropdown) return;

//     if (e.key === 'ArrowDown') {
//       e.preventDefault();
//       setHighlightedIndex((prev) => (prev < airports.length - 1 ? prev + 1 : 0));
//     } else if (e.key === 'ArrowUp') {
//       e.preventDefault();
//       setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : airports.length - 1));
//     } else if (e.key === 'Enter') {
//       e.preventDefault();
//       if (highlightedIndex >= 0 && highlightedIndex < airports.length) {
//         handleSelect(airports[highlightedIndex]);
//       }
//     } else if (e.key === 'Escape') {
//       setShowDropdown(false);
//     }
//   };

//   return (
//     <div ref={containerRef} style={{ position: 'relative', width: 320, marginBottom: 20 }}>
//       <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 6 }}>{label}</label>
//       <input
//         type="text"
//         value={query}
//         placeholder="Start typing airport name..."
//         onChange={(e) => setQuery(e.target.value)}
//         onFocus={() => query.length >= 3 && setShowDropdown(true)}
//         onKeyDown={handleKeyDown}
//         style={{
//           width: '100%',
//           padding: '8px 10px',
//           fontSize: 16,
//           borderRadius: 4,
//           border: '1px solid #ccc',
//           boxSizing: 'border-box',
//         }}
//         autoComplete="off"
//       />
//       {showDropdown && airports.length > 0 && (
//         <ul
//           style={{
//             position: 'absolute',
//             top: '100%',
//             left: 0,
//             right: 0,
//             maxHeight: 240,
//             overflowY: 'auto',
//             border: '1px solid #ccc',
//             borderRadius: '0 0 4px 4px',
//             backgroundColor: '#fff',
//             margin: 0,
//             padding: 0,
//             listStyleType: 'none',
//             zIndex: 9999,
//           }}
//         >
//           {airports.map((airport, index) => (
//             <li
//               key={airport.id}
//               onClick={() => handleSelect(airport)}
//               onMouseEnter={() => setHighlightedIndex(index)}
//               style={{
//                 padding: '8px 12px',
//                 cursor: 'pointer',
//                 backgroundColor: index === highlightedIndex ? '#007bff' : 'transparent',
//                 color: index === highlightedIndex ? 'white' : 'black',
//               }}
//             >
//               <strong>{airport.name} ({airport.iataCode})</strong> — {airport.address.cityName}
//             </li>
//           ))}
//         </ul>
//       )}
//       {showDropdown && airports.length === 0 && (
//         <div
//           style={{
//             position: 'absolute',
//             top: '100%',
//             left: 0,
//             right: 0,
//             padding: 10,
//             border: '1px solid #ccc',
//             borderRadius: '0 0 4px 4px',
//             backgroundColor: '#fff',
//             color: '#666',
//             fontStyle: 'italic',
//             zIndex: 9999,
//           }}
//         >
//           No airports found.
//         </div>
//       )}
//     </div>
//   );
// };

// export default AirportAutocomplete;
