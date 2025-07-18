import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  try {
    const formData = await readFormData(event);
    const csvFile = formData.get('csv') as File;
    
    if (!csvFile) {
      return {
        success: false,
        error: 'No CSV file provided',
        properties: [],
        totalCount: 0
      };
    }

    // Read the uploaded CSV content
    const csvContent = await csvFile.text();
    
    // Parse CSV content
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      return {
        success: false,
        error: 'CSV file must have at least a header row and one data row',
        properties: [],
        totalCount: 0
      };
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    // Validate required headers
    const requiredHeaders = ['Address', 'APN', 'Phase'];
    const missingHeaders = requiredHeaders.filter(header => 
      !headers.some(h => h.toLowerCase() === header.toLowerCase())
    );
    
    if (missingHeaders.length > 0) {
      return {
        success: false,
        error: `Missing required headers: ${missingHeaders.join(', ')}`,
        properties: [],
        totalCount: 0
      };
    }

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
        switch (header.toLowerCase()) {
          case 'permit #':
          case 'permit':
            property.permit = value;
            break;
          case 'project':
            property.project = value;
            break;
          case 'style':
            property.style = value;
            break;
          case 'pm':
            property.pm = value;
            break;
          case 'address':
            property.address = value;
            break;
          case 'apn':
            property.apn = value;
            break;
          case 'city':
            property.city = value;
            break;
          case 'lot':
            property.lot = value;
            break;
          case 'sq.ft.':
          case 'sqft':
          case 'square feet':
            property.sqft = value;
            break;
          case 'client':
            property.client = value;
            break;
          case 'phase':
            property.phase = value;
            break;
          case 'draw':
            property.draw = value;
            break;
          case 'notes':
            property.notes = value;
            break;
          case 'permit submitted':
            property.permitSubmitted = value;
            break;
          case 'permit issued':
            property.permitIssued = value;
            break;
          case 'start date':
            property.startDate = value;
            break;
          case 'deadline':
            property.deadline = value;
            break;
          case 'cert of occ':
            property.certOfOcc = value;
            break;
          case 'completed':
            property.completed = value;
            break;
          case 'days since start':
            property.daysSinceStart = value;
            break;
          case 'days since submital':
            property.daysSinceSubmital = value;
            break;
          case 'windows ordered':
            property.windowsOrdered = value;
            break;
          case 'days from start to finish':
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
    
    if (properties.length === 0) {
      return {
        success: false,
        error: 'No valid properties found in CSV file',
        properties: [],
        totalCount: 0
      };
    }

    // Optionally save the uploaded CSV as a backup
    try {
      const backupPath = join(process.cwd(), 'uploaded-data.csv');
      writeFileSync(backupPath, csvContent);
    } catch (writeError) {
      console.warn('Failed to save uploaded CSV backup:', writeError);
    }
    
    return {
      success: true,
      properties,
      totalCount: properties.length,
      lastUpdated: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error processing uploaded CSV:', error);
    return {
      success: false,
      error: 'Failed to process CSV file',
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