const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

app.get('/api/random-user', async (req, res) => {
  try {
    // Step 1: Fetch random user data
    console.log('Fetching random user...');
    const userResponse = await axios.get('https://randomuser.me/api/');
    const userData = userResponse.data.results[0];

    // Extract user information
    const user = {
      firstName: userData.name.first,
      lastName: userData.name.last,
      gender: userData.gender,
      age: userData.dob.age,
      dob: userData.dob.date.split('T')[0],
      city: userData.location.city,
      country: userData.location.country,
      address: `${userData.location.street.number} ${userData.location.street.name}`,
      picture: userData.picture.large,
      email: userData.email,
      coordinates: `${userData.location.coordinates.latitude}, ${userData.location.coordinates.longitude}`,
      phone: userData.phone
    };

    console.log(`User from ${user.country} fetched successfully`);

    // Step 2: Fetch country information
    console.log(`Fetching country info for ${user.country}...`);
    let countryInfo = null;
    let currencyCode = 'USD'; // Default currency

    try {
      const countryResponse = await axios.get(
        `https://restcountries.com/v3.1/name/${user.country}?fullText=true`
      );
      const countryData = countryResponse.data[0];

      // Extract country information
      const currencies = countryData.currencies || {};
      const currencyKey = Object.keys(currencies)[0];
      currencyCode = currencyKey || 'USD';

      const languages = countryData.languages || {};
      const languageList = Object.values(languages).join(', ');

      countryInfo = {
        name: countryData.name.common,
        capital: countryData.capital ? countryData.capital[0] : 'N/A',
        languages: languageList || 'N/A',
        currency: currencies[currencyKey] ? 
          `${currencies[currencyKey].name} (${currencyKey})` : 'N/A',
        currencyCode: currencyCode,
        flag: countryData.flags.svg,
        flagAlt: countryData.flags.alt || `Flag of ${countryData.name.common}`
      };

      console.log(`Country info fetched: ${countryInfo.name}`);
    } catch (error) {
      console.error('Error fetching country info:', error.message);
      countryInfo = {
        name: user.country,
        capital: 'N/A',
        languages: 'N/A',
        currency: 'N/A',
        currencyCode: 'USD',
        flag: null,
        flagAlt: `Flag of ${user.country}`
      };
    }

    // Step 3: Fetch exchange rates
    console.log(`Fetching exchange rates for ${currencyCode}...`);
    let exchangeRates = null;

    try {
      const exchangeResponse = await axios.get(
        `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/${currencyCode}`
      );

      if (exchangeResponse.data.result === 'success') {
        const rates = exchangeResponse.data.conversion_rates;
        exchangeRates = {
          baseCurrency: currencyCode,
          toUSD: rates.USD ? rates.USD.toFixed(4) : 'N/A',
          toKZT: rates.KZT ? rates.KZT.toFixed(2) : 'N/A',
          toEUR: rates.EUR ? rates.EUR.toFixed(4) : 'N/A',
          lastUpdate: exchangeResponse.data.time_last_update_utc
        };
        console.log(`Exchange rates fetched successfully`);
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error.message);
      exchangeRates = {
        baseCurrency: currencyCode,
        toUSD: 'N/A',
        toKZT: 'N/A',
        toEUR: 'N/A',
        lastUpdate: null
      };
    }

    // Step 4: Fetch news headlines
    console.log(`Fetching news for ${user.country}...`);
    let news = [];

    try {
      const newsResponse = await axios.get(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(user.country)}&language=en&pageSize=5&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`
      );

      if (newsResponse.data.status === 'ok' && newsResponse.data.articles) {
        news = newsResponse.data.articles.map(article => ({
          title: article.title,
          description: article.description || 'No description available',
          image: article.urlToImage || null,
          url: article.url,
          source: article.source.name,
          publishedAt: article.publishedAt
        }));
        console.log(`${news.length} news articles fetched`);
      }
    } catch (error) {
      console.error('Error fetching news:', error.message);
      news = [{
        title: 'News not available',
        description: 'Unable to fetch news at this time',
        image: null,
        url: '#',
        source: 'N/A',
        publishedAt: null
      }];
    }

    // Combine all data and send response
    const responseData = {
      user,
      countryInfo,
      exchangeRates,
      news
    };

    console.log('All data fetched successfully, sending response');
    res.json(responseData);

  } catch (error) {
    console.error('Error in /api/random-user:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch user data',
      message: error.message 
    });
  }
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 