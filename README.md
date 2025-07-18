# DJ DJ LLC Property Management Dashboard

A modern Nuxt.js application for managing and tracking property development projects across Bellingham and Blaine areas.

## Features

- **Dynamic CSV Integration**: Automatically loads and updates from `sampledata.csv`
- **CSV Upload Backup**: Upload your own CSV file if the default data fails to load
- **Real-time Updates**: Auto-refreshes data every 5 minutes
- **Dashboard Overview**: Comprehensive statistics and phase distribution charts
- **Property Management**: View all properties with filtering and search capabilities
- **ArcGIS Integration**: Direct links to ArcGIS maps for each property
- **Responsive Design**: Modern, mobile-friendly interface
- **Live Data**: Property data with construction phases and timelines

## Technology Stack

- **Nuxt 3**: Vue.js framework for server-side rendering
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Chart.js**: Interactive charts and visualizations
- **Font Awesome**: Icon library

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd djdjmeetingmap
```

2. Install dependencies:
```bash
npm install
```

3. Ensure your CSV data file is in place:
```bash
# The application expects sampledata.csv in the project root
# This file should contain your property data with the correct headers
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

### Updating Data

The website automatically loads data from `sampledata.csv`. To update the website:

1. **Edit the CSV file**: Modify `sampledata.csv` with your latest property data
2. **Save the file**: The changes will be detected automatically
3. **Refresh the website**: Or wait for the 5-minute auto-refresh

### CSV Upload (Backup Option)

If the default data fails to load (e.g., on Vercel deployment), you can upload your own CSV file:

1. **Click "Upload CSV"** in the navigation or dashboard
2. **Select your CSV file** or drag and drop it
3. **Download the template** to see the expected format
4. **Upload and process** your data

**CSV Format Requirements:**
- First row must contain headers
- Required columns: `Address`, `APN`, `Phase`
- Optional columns: `City`, `Client`, `Notes`, `Permit Submitted`, etc.
- Empty cells are allowed
- The application will automatically categorize properties based on the `Phase` column

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
├── assets/
│   └── css/
│       └── main.css          # Global styles and custom CSS
├── components/
│   ├── PropertyCard.vue      # Individual property card component
│   └── PropertyDetail.vue    # Detailed property view component
├── composables/
│   └── useProperties.ts      # Property data management and state
├── pages/
│   └── index.vue             # Main dashboard page
├── app.vue                   # Root application component
├── nuxt.config.ts            # Nuxt configuration
└── package.json              # Dependencies and scripts
```

## Features Overview

### Dashboard
- Property statistics and counts
- Phase distribution chart
- Recent activity feed
- Quick action buttons

### Property List
- Search by address, APN, or city
- Filter by construction phase
- Grid view of all properties
- Quick access to details and maps

### Property Details
- Comprehensive property information
- Project timeline and milestones
- Financial and timeline data
- Direct links to ArcGIS maps

## Data Structure

Properties are categorized by:
- **Construction**: Active development projects (Sheetrock, Flatwork, Roof, Final phases)
- **Completed**: Finished projects (Sold, Listed, Pending phases)
- **Upcoming**: Future developments (Design phase)

## ArcGIS Integration

The application integrates with ArcGIS Experience Builder for:
- Interactive property mapping
- Geographic visualization
- Property location tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is proprietary to DJ DJ LLC. 