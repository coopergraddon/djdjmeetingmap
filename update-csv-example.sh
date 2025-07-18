#!/bin/bash

# Example script to demonstrate dynamic CSV updates
echo "🔄 DJ DJ Property Management - CSV Update Demo"
echo "=============================================="

# Check if the CSV file exists
if [ ! -f "sampledata.csv" ]; then
    echo "❌ Error: sampledata.csv not found!"
    exit 1
fi

echo "📊 Current CSV file: sampledata.csv"
echo "🌐 Website running at: http://localhost:3000"
echo ""
echo "📝 To update the website data:"
echo "1. Edit the sampledata.csv file"
echo "2. Save the file"
echo "3. Refresh the website (or wait for auto-refresh)"
echo ""
echo "🔄 The website will automatically:"
echo "   - Detect CSV changes"
echo "   - Update property counts"
echo "   - Refresh the phase distribution chart"
echo "   - Update all property listings"
echo ""
echo "📋 CSV Format:"
echo "   - First row: Headers (Permit #, Project, Style, PM, Address, APN, etc.)"
echo "   - Each subsequent row: Property data"
echo "   - Empty cells are allowed"
echo ""
echo "🎯 Key columns for website functionality:"
echo "   - Address: Property address"
echo "   - APN: Property identification number"
echo "   - Phase: Construction phase (Design, Sheetrock, Final, Sold, etc.)"
echo "   - City: Property location"
echo "   - Client: Property owner/client"
echo "   - Notes: Additional information"
echo ""
echo "✨ The website will automatically categorize properties based on Phase:"
echo "   - Construction: Sheetrock, Flatwork, Roof, Final"
echo "   - Completed: Sold, Listed, Pending"
echo "   - Upcoming: Design, Hold, Upcoming"
echo ""
echo "🚀 Ready to update! Edit sampledata.csv and refresh the website." 