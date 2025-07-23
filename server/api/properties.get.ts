import { $fetch } from 'ofetch';

const CSV_URLS = [
  'https://raw.githubusercontent.com/coopergraddon/djdjmeetingmap/refs/heads/main/DJ%20DJ%20LLC%20Master%20Sheet(Completed).csv',
  'https://raw.githubusercontent.com/coopergraddon/djdjmeetingmap/refs/heads/main/DJ%20DJ%20LLC%20Master%20Sheet(Construction%20Stages).csv',
  'https://raw.githubusercontent.com/coopergraddon/djdjmeetingmap/refs/heads/main/DJ%20DJ%20LLC%20Master%20Sheet(Upcoming).csv',
];

export default defineEventHandler(async (event) => {
  try {
    // Fetch all CSVs in parallel
    const csvContents = await Promise.all(
      CSV_URLS.map(url => $fetch(url, { responseType: 'text' }))
    );

    let properties = [];
    for (const csvContent of csvContents) {
      const lines = csvContent.split('\n').filter(line => line.trim());
      if (lines.length < 2) continue; // skip empty files
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, '').toLowerCase());
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;
        const values = parseCSVLine(line);
        while (values.length < headers.length) values.push('');
        const property: any = {};
        headers.forEach((header, index) => {
          let value = values[index] || '';
          value = value.trim().replace(/"/g, '');
          switch (header) {
            case 'permit #': property.permit = value; break;
            case 'project': property.project = value; break;
            case 'style': property.style = value; break;
            case 'pm': property.pm = value; break;
            case 'project manager': property.pmName = value; break;
            case 'pm phone number': property.pmPhone = value; break;
            case 'pm email': property.pmEmail = value; break;
            case 'address': property.address = value; break;
            case 'apn': property.apn = value; break;
            case 'city': property.city = value; break;
            case 'lot': property.lot = value; break;
            case 'sq.ft.': property.sqft = value; break;
            case 'client': property.client = value; break;
            case 'phase': property.phase = value; break;
            case 'draw': property.draw = value; break;
            case 'notes': property.notes = value; break;
            case 'permit submitted': property.permitSubmitted = value; break;
            case 'permit issued': property.permitIssued = value; break;
            case 'start date': property.startDate = value; break;
            case 'deadline': property.deadline = value; break;
            case 'cert of occ': property.certOfOcc = value; break;
            case 'completed': property.completed = value; break;
            case 'days since start': property.daysSinceStart = value; break;
            case 'days since submital': property.daysSinceSubmital = value; break;
            case 'windows ordered': property.windowsOrdered = value; break;
            case 'days from start to finish': property.daysFromStartToFinish = value; break;
            case 'financial institution': property.financialInstitution = value; break;
            case 'latest updates': property.latestUpdates = value; break;
            case 'date comments added': property.dateCommentsAdded = value; break;
            default: property[header] = value;
          }
        });
        if (property.address || property.apn) {
          property.id = `property-${property.apn || property.address?.replace(/\s+/g, '-').toLowerCase() || Math.random().toString(36).slice(2)}`;
          if (['Sheetrock', 'Flatwork', 'Roof', 'Final'].includes(property.phase)) {
            property.category = 'Construction';
          } else if (['Sold', 'Listed', 'Pending'].includes(property.phase)) {
            property.category = 'Completed';
          } else if (['Design', 'Hold', 'Upcoming'].includes(property.phase)) {
            property.category = 'Upcoming';
          } else {
            property.category = 'Other';
          }
          property.type = property.style || property.project || 'Residential';
          properties.push(property);
        }
      }
    }

    // Filter out properties in the 'Delete' phase
    properties = properties.filter(p => p.phase?.toLowerCase() !== 'delete');

    return {
      success: true,
      properties,
      totalCount: properties.length,
      lastUpdated: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error reading CSV files:', error);
    return {
      success: false,
      error: 'Failed to read CSV files',
      properties: [],
      totalCount: 0
    };
  }
});

// Helper function to parse CSV lines with proper comma handling
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
} 