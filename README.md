# What Happened On...?

A React TypeScript application that shows interesting events from a specific date, including New York Times articles, seismic activity, and asteroid information.

## Features

- Search for events by date
- View New York Times articles from that date
- See earthquake data from USGS
- Check asteroid information from NASA

## Technologies Used

- React 18
- TypeScript
- Vite
- Bootstrap 5
- React Bootstrap
- Moment.js

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your API keys:
   ```
   VITE_NYT_API_KEY=your_nyt_api_key_here
   VITE_NASA_API_KEY=your_nasa_api_key_here
   ```
   - Get your NYT API key from: https://developer.nytimes.com/
   - Get your NASA API key from: https://api.nasa.gov/

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Information

The application uses three different APIs:

1. **New York Times API**: Articles published on the selected date
2. **USGS Earthquake API**: Seismic activity data
3. **NASA NEO API**: Near-Earth Object information

## Project Structure

```
src/
  ├── components/
  │   ├── BirthdayForm.tsx
  │   └── ResultsView.tsx
  ├── App.tsx
  ├── App.css
  └── main.tsx
```

## Contributing

Feel free to submit issues and enhancement requests!
