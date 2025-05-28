// components/FlightResults.js
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Pagination,
  Box,
} from '@mui/material';

const FlightResults = ({ flights }) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const handleChange = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const selectedFlights = flights.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        {selectedFlights.map((flight, index) => {
          const segment = flight.itineraries[0].segments[0];
          return (
            <Grid item xs={12} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">
                    {segment.departure.iataCode} → {segment.arrival.iataCode}
                  </Typography>
                  <Typography>
                    Airline: {segment.carrierCode} | Flight: {segment.number}
                  </Typography>
                  <Typography>
                    Departure: {new Date(segment.departure.at).toLocaleString()}
                  </Typography>
                  <Typography>
                    Arrival: {new Date(segment.arrival.at).toLocaleString()}
                  </Typography>
                  <Typography>
                    Duration: {segment.duration.replace('PT', '')}
                  </Typography>
                  <Typography fontWeight="bold" mt={1}>
                    ₹{flight.price.total}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={Math.ceil(flights.length / itemsPerPage)}
          page={page}
          onChange={handleChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default FlightResults;
