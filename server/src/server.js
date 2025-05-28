const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const CLIENT_ID = "cKHsGVhdzlXinjnGBragIzEooJ7grHsf";
const CLIENT_SECRET = "g10qIiLx5ThBXAMU";

let accessToken = "";
let tokenExpiryTime = 0;

// Get access token and update expiry time
async function getAccessToken() {
  try {
    const response = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    accessToken = response.data.access_token;
    tokenExpiryTime = Date.now() + (response.data.expires_in - 60) * 1000; // expire 60s before actual expiry
    console.log("✔️ Access Token acquired once");
  } catch (error) {
    console.error(
      "❌ Error getting access token:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Middleware to ensure valid token
async function ensureAccessToken() {
  if (!accessToken || Date.now() >= tokenExpiryTime) {
    await getAccessToken();
  }
}

app.get("/api/airports", async (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) {
    return res.status(400).json({ error: "Missing keyword parameter" });
  }

  try {
    await ensureAccessToken();

    const requestConfig = {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        subType: "AIRPORT",
        keyword,
        "page[limit]": 10,
        "page[offset]": 0,
        sort: "analytics.travelers.score",
        view: "FULL",
      },
    };

    const response = await axios.get(
      "https://test.api.amadeus.com/v1/reference-data/locations",
      requestConfig
    );

    return res.json(
      Array.isArray(response.data.data) ? response.data.data : []
    );
  } catch (error) {
    if (error.response?.status === 401) {
      // Retry with refreshed token
      try {
        await getAccessToken();
        const retryResponse = await axios.get(
          "https://test.api.amadeus.com/v1/reference-data/locations",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
              subType: "AIRPORT",
              keyword,
              "page[limit]": 10,
              "page[offset]": 0,
              sort: "analytics.travelers.score",
              view: "FULL",
            },
          }
        );
        console.log(retryResponse);
        return res.json(
          Array.isArray(retryResponse.data.data) ? retryResponse.data.data : []
        );
      } catch (retryError) {
        return res
          .status(500)
          .json({ error: "Retry failed after refreshing token." });
      }
    }

    console.error(
      "❌ Amadeus API Error:",
      error.response?.data || error.message
    );
    return res.status(error.response?.status || 500).json({
      error: error.response?.data || "Internal Server Error",
    });
  }
});

app.get("/api/flight-search", async (req, res) => {
  try {
    await ensureAccessToken();

    // const params = {
    //   originLocationCode: req.query.originLocationCode,
    //   destinationLocationCode: req.query.destinationLocationCode,
    //   departureDate: req.query.departureDate,
    //   returnDate: req.query.returnDate,
    //   adults: req.query.adults,
    //   children: req.query.children || 0,
    //   infants: req.query.infants || 0,
    //   travelClass: req.query.travelClass,
    //   includedAirlineCodes: req.query.includedAirlineCodes,
    //   excludedAirlineCodes: req.query.excludedAirlineCodes,
    //   nonStop: req.query.nonStop,
    //   currencyCode: req.query.currencyCode || 'INR',
    //   maxPrice: req.query.maxPrice,
    //   max: req.query.max || 50,
    // };

    // // Remove undefined or empty params
    // Object.keys(params).forEach(key => {
    //   if (params[key] === undefined || params[key] === '' || params[key] === 'false') {
    //     delete params[key];
    //   }
    // });

    const params = {
      originLocationCode: req.query.originLocationCode,
      destinationLocationCode: req.query.destinationLocationCode,
      departureDate: req.query.departureDate,
      returnDate: req.query.returnDate || undefined,
      adults: req.query.adults,
      children:
        req.query.children && req.query.children !== "0"
          ? req.query.children
          : undefined,
      infants:
        req.query.infants && req.query.infants !== "0"
          ? req.query.infants
          : undefined,
      travelClass: req.query.travelClass || undefined,
      includedAirlineCodes: req.query.includedAirlineCodes || undefined,
      excludedAirlineCodes: req.query.excludedAirlineCodes || undefined,
      nonStop:
        req.query.nonStop === "true"
          ? true
          : req.query.nonStop === "false"
          ? false
          : undefined,
      currencyCode: req.query.currencyCode || "INR",
      maxPrice:
        req.query.maxPrice && !isNaN(req.query.maxPrice)
          ? req.query.maxPrice
          : undefined,
      max: req.query.max || 50,
    };

    // Remove undefined params
    Object.keys(params).forEach((key) => {
      if (params[key] === undefined) {
        delete params[key];
      }
    });

    const response = await axios.get(
      "https://test.api.amadeus.com/v2/shopping/flight-offers",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "❌ Flight Search Error:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Internal Server Error",
    });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});
