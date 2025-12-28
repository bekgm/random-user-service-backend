# Random User Info Application

A Node.js web application that fetches random user data and displays comprehensive information including country details, currency exchange rates, and related news headlines.

## Features

- Random user generation with detailed personal information
- Country information (capital, languages, currency, flag)
- Real-time currency exchange rates (USD & KZT)
- Latest news headlines from user's country
- Responsive and modern UI design

## Project Structure

```
project/
│
├── server.js              # Main server file
├── public/                # Static files
│   ├── index.html        # Frontend HTML
│   ├── style.css         # Styling
│   └── script.js         # Client-side JavaScript
├── .env                  # Environment variables (API keys)
├── package.json          # Dependencies
└── README.md            # Documentation
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
NEWS_API_KEY=*****************
EXCHANGE_API_KEY=******************
PORT=3000
```

### 3. Run the Application

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

### GET `/api/random-user`
Fetches a random user with all associated information:
- User details (name, age, location, etc.)
- Country information
- Currency exchange rates
- News headlines

**Response Example:**
```json
{
  "user": {
    "firstName": "Helmi",
    "lastName": "Lampo",
    "gender": "female",
    "age": 65,
    "dob": "1960-04-07",
    "city": "Lapua",
    "country": "Finland",
    "address": "6390 Pirkankatu",
    "picture": "https://randomuser.me/api/portraits/women/91.jpg"
  },
  "countryInfo": {...},
  "exchangeRates": {...},
  "news": [...]
}
```

## Dependencies

- **express** - Web framework
- **axios** - HTTP client for API requests
- **dotenv** - Environment variable management
- **nodemon** (dev) - Auto-reload during development

## Design Decisions

### 1. Server-Side API Calls
All API requests are made on the server side to:
- Keep API keys secure
- Avoid CORS issues
- Centralize error handling
- Reduce client-side complexity

### 2. Single Endpoint Architecture
One endpoint (`/api/random-user`) fetches all data to:
- Minimize client-server roundtrips
- Ensure data consistency
- Simplify frontend logic

### 3. Error Handling
- Graceful degradation for missing data
- User-friendly error messages
- Fallback values for unavailable information

### 4. Responsive Design
- Mobile-first approach
- CSS Grid and Flexbox for layouts
- Smooth animations and transitions

## Usage

1. Click the **"Generate Random User"** button
2. View comprehensive user information including:
   - Personal details with profile picture
   - Country information with flag
   - Currency exchange rates
   - Latest news headlines from their country

## Technical Details

### API Integration Flow
1. Fetch random user from RandomUser API
2. Extract country name from user data
3. Fetch country details from REST Countries API
4. Get currency code from country data
5. Fetch exchange rates for user's currency
6. Fetch news headlines related to user's country
7. Combine all data and send to frontend

### Error Handling Strategy
- Try-catch blocks for all API calls
- Meaningful error messages for users
- Fallback data when APIs are unavailable
- Logging for debugging

## Known Limitations

- REST Countries API doesn't require an API key (free tier)
- News API has rate limits (100 requests/day on free tier)
- Exchange Rate API has monthly limits on free tier
