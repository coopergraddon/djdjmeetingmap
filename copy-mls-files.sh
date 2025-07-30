#!/bin/bash

# MLS Properties Page - File Copy Script
# This script helps copy the required files to recreate the MLS Properties page

echo "🏠 MLS Properties Page - File Copy Script"
echo "=========================================="
echo ""

# Check if destination directory is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide the destination directory"
    echo "Usage: ./copy-mls-files.sh <destination-directory>"
    echo ""
    echo "Example: ./copy-mls-files.sh ../new-mls-site"
    exit 1
fi

DEST_DIR="$1"

# Check if destination directory exists
if [ ! -d "$DEST_DIR" ]; then
    echo "❌ Error: Destination directory '$DEST_DIR' does not exist"
    echo "Please create the directory first or provide a valid path"
    exit 1
fi

echo "📁 Copying files to: $DEST_DIR"
echo ""

# Create necessary directories
echo "📂 Creating directory structure..."
mkdir -p "$DEST_DIR/pages"
mkdir -p "$DEST_DIR/components"
mkdir -p "$DEST_DIR/server/api"
mkdir -p "$DEST_DIR/assets/css"
mkdir -p "$DEST_DIR/docs"

# Copy core files
echo "📋 Copying core files..."

# Main MLS page
if [ -f "pages/mls.vue" ]; then
    cp "pages/mls.vue" "$DEST_DIR/pages/"
    echo "✅ Copied: pages/mls.vue"
else
    echo "❌ Missing: pages/mls.vue"
fi

# AppHeader component
if [ -f "components/AppHeader.vue" ]; then
    cp "components/AppHeader.vue" "$DEST_DIR/components/"
    echo "✅ Copied: components/AppHeader.vue"
else
    echo "❌ Missing: components/AppHeader.vue"
fi

# Server API endpoints
if [ -f "server/api/mls-properties.get.ts" ]; then
    cp "server/api/mls-properties.get.ts" "$DEST_DIR/server/api/"
    echo "✅ Copied: server/api/mls-properties.get.ts"
else
    echo "❌ Missing: server/api/mls-properties.get.ts"
fi

if [ -f "server/api/mls-score.ts" ]; then
    cp "server/api/mls-score.ts" "$DEST_DIR/server/api/"
    echo "✅ Copied: server/api/mls-score.ts"
else
    echo "❌ Missing: server/api/mls-score.ts"
fi

if [ -f "server/api/mls-scoring-analysis.get.ts" ]; then
    cp "server/api/mls-scoring-analysis.get.ts" "$DEST_DIR/server/api/"
    echo "✅ Copied: server/api/mls-scoring-analysis.get.ts"
else
    echo "❌ Missing: server/api/mls-scoring-analysis.get.ts"
fi

# CSS styling
if [ -f "assets/css/main.css" ]; then
    cp "assets/css/main.css" "$DEST_DIR/assets/css/"
    echo "✅ Copied: assets/css/main.css"
else
    echo "❌ Missing: assets/css/main.css"
fi

# Configuration files
if [ -f "nuxt.config.ts" ]; then
    cp "nuxt.config.ts" "$DEST_DIR/"
    echo "✅ Copied: nuxt.config.ts"
else
    echo "❌ Missing: nuxt.config.ts"
fi

if [ -f "package.json" ]; then
    cp "package.json" "$DEST_DIR/"
    echo "✅ Copied: package.json"
else
    echo "❌ Missing: package.json"
fi

# Documentation files
echo "📚 Copying documentation files..."

if [ -f "NWMLS_COMPLIANCE.md" ]; then
    cp "NWMLS_COMPLIANCE.md" "$DEST_DIR/docs/"
    echo "✅ Copied: docs/NWMLS_COMPLIANCE.md"
else
    echo "⚠️  Missing: NWMLS_COMPLIANCE.md"
fi

if [ -f "MLS_DISPLAY_STANDARDS_ANALYSIS.md" ]; then
    cp "MLS_DISPLAY_STANDARDS_ANALYSIS.md" "$DEST_DIR/docs/"
    echo "✅ Copied: docs/MLS_DISPLAY_STANDARDS_ANALYSIS.md"
else
    echo "⚠️  Missing: MLS_DISPLAY_STANDARDS_ANALYSIS.md"
fi

if [ -f "SCORING_SECURITY.md" ]; then
    cp "SCORING_SECURITY.md" "$DEST_DIR/docs/"
    echo "✅ Copied: docs/SCORING_SECURITY.md"
else
    echo "⚠️  Missing: SCORING_SECURITY.md"
fi

if [ -f "MLS_PAGE_FILES_LIST.md" ]; then
    cp "MLS_PAGE_FILES_LIST.md" "$DEST_DIR/docs/"
    echo "✅ Copied: docs/MLS_PAGE_FILES_LIST.md"
else
    echo "⚠️  Missing: MLS_PAGE_FILES_LIST.md"
fi

echo ""
echo "🎉 File copy completed!"
echo ""
echo "📋 Next steps:"
echo "1. Navigate to the destination directory:"
echo "   cd $DEST_DIR"
echo ""
echo "2. Install dependencies:"
echo "   npm install"
echo ""
echo "3. Update API configuration:"
echo "   - Edit server/api/mls-properties.get.ts"
echo "   - Replace API_KEY with your MLS Grid API key"
echo ""
echo "4. Update branding:"
echo "   - Edit components/AppHeader.vue"
echo "   - Update company name and logo"
echo ""
echo "5. Start development server:"
echo "   npm run dev"
echo ""
echo "📖 For detailed instructions, see: docs/MLS_PAGE_FILES_LIST.md"
echo ""
echo "🔐 Remember to:"
echo "- Secure your API keys"
echo "- Update environment variables"
echo "- Test the scoring system"
echo "- Verify compliance requirements"
echo ""
echo "🚀 Ready to deploy your MLS Properties page!" 