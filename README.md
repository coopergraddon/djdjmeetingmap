# DJ DJ LLC Property Management System

A modern, responsive web application built with Nuxt 3 for managing and tracking property development projects. This system allows for dynamic CSV data import and provides comprehensive property portfolio management.

## Features

### 🏠 Property Portfolio Management
- **Dashboard Overview**: Interactive charts and statistics
- **Property Listings**: Filterable and searchable property cards
- **Detailed Property Views**: Comprehensive property information
- **Phase Tracking**: Visual indicators for construction phases

### 📊 Data Management
- **CSV Import**: Drag-and-drop CSV file upload
- **Dynamic Parsing**: Automatic field mapping and data validation
- **Real-time Updates**: Instant dashboard updates after data import
- **Flexible Schema**: Supports various CSV formats and field names

### 🗺️ ArcGIS Integration
- **Map Integration**: Direct links to ArcGIS Experience
- **Property Mapping**: Individual property map views
- **Geospatial Data**: APN-based property identification

### 📱 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Glass Morphism**: Modern visual effects and animations
- **Interactive Charts**: Chart.js integration for data visualization
- **Tailwind CSS**: Utility-first styling approach

## Technology Stack

- **Frontend Framework**: Nuxt 3 (Vue.js)
- **State Management**: Pinia
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Chart.js with Vue-ChartJS
- **CSV Parsing**: PapaParse
- **TypeScript**: Full type safety

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd dj-dj-property-management
npm install
```

2. **Start development server**:
```bash
npm run dev
```

3. **Build for production**:
```bash
npm run build
```

## CSV Data Format

The system can automatically parse CSV files with the following supported field names (case-insensitive):

### Required Fields
- `address` / `Address` - Property address
- `apn` / `APN` - Assessor's Parcel Number
- `phase` / `Phase` - Current project phase
- `city` / `City` - Property city

### Optional Fields
- `type` / `Type` - Property type
- `permit` / `Permit` - Permit number
- `sqft` / `SQFT` / `Square Feet` - Square footage
- `client` / `Client` - Client name
- `startDate` / `Start Date` - Project start date
- `deadline` / `Deadline` - Target completion date
- `completed` / `Completed` - Completion date
- `notes` / `Notes` - Project notes
- `permitSubmitted` / `Permit Submitted` - Permit submission date
- `permitIssued` / `Permit Issued` - Permit issue date
- `daysToComplete` / `Days to Complete` - Project duration
- `estimatedDaysToComplete` / `Estimated Days` - Estimated duration
- `financialInstitution` / `Financial Institution` - Lender information

### Supported Phases
- **Construction**: Sheetrock, Flatwork, Roof, Final
- **Completed**: Sold, Listed, Pending
- **Upcoming**: Design, Delete, Hold, Unknown

## Project Structure

```
├── assets/
│   └── css/
│       └── main.css          # Global styles and CSS variables
├── components/
│   ├── ActivityItem.vue      # Recent activity items
│   ├── CSVUpload.vue         # CSV file upload component
│   ├── HeaderComponent.vue   # Navigation header
│   ├── PhaseChart.vue        # Phase distribution chart
│   ├── PropertyCard.vue      # Property card component
│   ├── PropertyDetailRow.vue # Property detail row
│   ├── RecentActivity.vue    # Recent activity section
│   └── StatsCard.vue         # Statistics cards
├── layouts/
│   └── default.vue           # Main layout template
├── pages/
│   ├── index.vue            # Dashboard home page
│   └── properties/
│       ├── index.vue        # Properties list page
│       └── [id].vue         # Property detail page
├── stores/
│   └── properties.ts        # Pinia store for property management
├── nuxt.config.ts           # Nuxt configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json            # Dependencies and scripts
```

## Configuration

### Environment Variables
Set these in your `.env` file or runtime config:

```bash
# ArcGIS Integration
NUXT_PUBLIC_ARCGIS_EXPERIENCE_URL=https://experience.arcgis.com/experience/c69f053c68e84a0ab98bc80b00836949/
NUXT_PUBLIC_DATA_SOURCE_ID=dataSource_5-c618cc10482c44689186cffcf8f4521a
```

### Customizing the Design System

The application uses CSS custom properties for easy theming:

```css
:root {
  --primary-green: #1e4d4b;
  --secondary-green: #2a6a67;
  --light-green: #3a7b78;
  --accent-green: #4a8d8a;
  --bg-green: #f0f9f8;
}
```

## Usage

### 1. Upload CSV Data
- Visit the dashboard
- Use the CSV upload component to drag and drop or select CSV files
- The system will automatically parse and categorize properties

### 2. Navigate Properties
- Use the navigation menu to filter by category
- Search properties by address, APN, or city
- Filter by construction phase

### 3. View Property Details
- Click "Details" on any property card
- View comprehensive property information
- Access ArcGIS maps directly from property views

### 4. Monitor Progress
- Dashboard provides real-time statistics
- Phase distribution chart shows project status
- Recent activity feed tracks changes

## Development

### Adding New Property Fields
1. Update the `Property` interface in `stores/properties.ts`
2. Add field mapping in the CSV parser
3. Update UI components to display new fields

### Customizing Phase Categories
1. Modify phase arrays in the store getters
2. Update phase color mappings in components
3. Adjust chart colors in `PhaseChart.vue`

### Extending CSV Support
The CSV parser is flexible and can be extended to support additional field formats by modifying the `parseCSVFile` method in the properties store.

## Deployment

### Static Generation
```bash
npm run generate
```

### Server-Side Rendering
```bash
npm run build
npm run preview
```

### Hosting
The application can be deployed to:
- Vercel
- Netlify  
- AWS Amplify
- Traditional web hosting (static)

## Support

For technical support or questions about the property management system, please refer to the project documentation or contact the development team.

## License

Copyright © 2025 DJ DJ LLC. All rights reserved.