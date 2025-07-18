import { readFileSync } from 'fs';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  try {
    // Read the CSV file from the project root
    const csvPath = join(process.cwd(), 'sampledata.csv');
    const csvContent = readFileSync(csvPath, 'utf-8');
    
    // Parse CSV content
    const lines = csvContent.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    const properties = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      
      // Handle CSV parsing with proper comma handling
      const values = parseCSVLine(line);
      
      if (values.length < headers.length) {
        // Pad with empty values if needed
        while (values.length < headers.length) {
          values.push('');
        }
      }
      
      const property: any = {};
      
      headers.forEach((header, index) => {
        let value = values[index] || '';
        value = value.trim().replace(/"/g, '');
        
        // Map CSV headers to our property structure
        switch (header) {
          case 'Permit #':
            property.permit = value;
            break;
          case 'Project':
            property.project = value;
            break;
          case 'Style':
            property.style = value;
            break;
          case 'PM':
            property.pm = value;
            break;
          case 'Address':
            property.address = value;
            break;
          case 'APN':
            property.apn = value;
            break;
          case 'City':
            property.city = value;
            break;
          case 'Lot':
            property.lot = value;
            break;
          case 'SQ.FT.':
            property.sqft = value;
            break;
          case 'Client':
            property.client = value;
            break;
          case 'Phase':
            property.phase = value;
            break;
          case 'Draw':
            property.draw = value;
            break;
          case 'Notes':
            property.notes = value;
            break;
          case 'Permit Submitted':
            property.permitSubmitted = value;
            break;
          case 'Permit Issued':
            property.permitIssued = value;
            break;
          case 'Start Date':
            property.startDate = value;
            break;
          case 'Deadline':
            property.deadline = value;
            break;
          case 'Cert of OCC':
            property.certOfOcc = value;
            break;
          case 'Completed':
            property.completed = value;
            break;
          case 'Days Since Start':
            property.daysSinceStart = value;
            break;
          case 'Days Since Submital':
            property.daysSinceSubmital = value;
            break;
          case 'Windows ordered':
            property.windowsOrdered = value;
            break;
          case 'Days from Start to Finish':
            property.daysFromStartToFinish = value;
            break;
          default:
            property[header] = value;
        }
      });
      
      // Only add properties that have at least an address or APN
      if (property.address || property.apn) {
        // Generate a unique ID
        property.id = `property-${property.apn || property.address?.replace(/\s+/g, '-').toLowerCase()}`;
        
        // Determine category based on phase
        if (['Sheetrock', 'Flatwork', 'Roof', 'Final'].includes(property.phase)) {
          property.category = 'Construction';
        } else if (['Sold', 'Listed', 'Pending'].includes(property.phase)) {
          property.category = 'Completed';
        } else if (['Design', 'Hold', 'Upcoming'].includes(property.phase)) {
          property.category = 'Upcoming';
        } else {
          property.category = 'Other';
        }
        
        // Set type based on style or project
        property.type = property.style || property.project || 'Residential';
        
        properties.push(property);
      }
    }
    
    return {
      success: true,
      properties,
      totalCount: properties.length,
      lastUpdated: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return {
      success: false,
      error: 'Failed to read CSV file',
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