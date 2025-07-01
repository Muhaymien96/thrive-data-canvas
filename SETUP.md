# MCP Servers Setup Guide

This guide covers setting up both the **Supabase MCP Server** and **Puppeteer MCP Server** for the VentureHub application.

## Overview

### Supabase MCP Server
Provides REST API access to your Supabase database for business data management.

### Puppeteer MCP Server  
Provides web automation, scraping, and browser control capabilities.

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env.server` file in the root directory:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. Start the Servers

**Supabase MCP Server (Port 3100):**
```bash
npm run mcp
```

**Puppeteer MCP Server (Port 3101):**
```bash
npm run mcp:puppeteer
```

### 4. Verify Installation
```bash
# Test Supabase server
curl http://localhost:3100/health

# Test Puppeteer server  
curl http://localhost:3101/health
```

## Available Servers

### Supabase MCP Server (Port 3100)
- **Database Operations**: CRUD for customers, businesses, transactions, products, employees, suppliers
- **Analytics**: Revenue and stock analytics
- **Search**: Cross-entity search functionality

**Key Endpoints:**
- `GET /customers` - Customer management
- `GET /transactions` - Transaction records  
- `GET /analytics/revenue` - Revenue analytics
- `GET /search` - Global search

### Puppeteer MCP Server (Port 3101)
- **Screenshot Generation**: Capture web page screenshots
- **PDF Generation**: Convert web pages to PDF
- **Web Scraping**: Extract data using CSS selectors
- **Form Submission**: Automate form filling
- **Performance Monitoring**: Page load metrics
- **Browser Automation**: Complex automation workflows

**Key Endpoints:**
- `POST /screenshot` - Take screenshots
- `POST /pdf` - Generate PDFs
- `POST /scrape` - Web scraping
- `POST /automate` - Browser automation

## Testing

### Test Supabase Server
```bash
npm run mcp:test
```

### Test Puppeteer Server
```bash
npm run mcp:puppeteer:test
```

## Usage Examples

### Supabase Server Examples

**Get customers:**
```bash
curl "http://localhost:3100/customers?business_id=your_business_id"
```

**Create customer:**
```bash
curl -X POST "http://localhost:3100/customers" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "business_id": "your_business_id"}'
```

### Puppeteer Server Examples

**Take screenshot:**
```bash
curl -X POST "http://localhost:3101/screenshot" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "width": 1200, "height": 800}' \
  --output screenshot.png
```

**Scrape website:**
```bash
curl -X POST "http://localhost:3101/scrape" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "selectors": [
      {"name": "title", "css": "h1", "type": "text"}
    ]
  }'
```

## Configuration

Both servers use the same configuration system:
- **Ports**: Supabase (3100), Puppeteer (3101)
- **Environment**: Loaded from `.env.server`
- **Logging**: Request logging enabled by default

## Security Considerations

### Supabase Server
- Uses service role key for full database access
- Implement authentication for production
- Use business-specific filtering

### Puppeteer Server  
- Runs browsers in headless mode
- Sandbox disabled for compatibility
- Proper resource cleanup after operations

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Supabase server: Change PORT in config
   - Puppeteer server: Change PORT in puppeteerServer.ts

2. **Database Connection**
   - Verify Supabase URL and service role key
   - Check internet connectivity

3. **Browser Issues**
   - Ensure Puppeteer is installed
   - Check Chrome/Chromium dependencies
   - Verify sandbox settings

4. **Type Errors**
   - Run `npm install` to ensure dependencies
   - Check TypeScript configuration

## Development

### Adding Features

**Supabase Server:**
1. Add endpoints to `mcp/mcpServer.ts`
2. Update `mcp/README.md`
3. Add tests to `mcp/test-endpoints.js`

**Puppeteer Server:**
1. Add endpoints to `mcp/puppeteerServer.ts`
2. Update `mcp/PUPPETEER_README.md`
3. Add tests to `mcp/test-puppeteer.js`

## Integration

Both servers can be integrated with:
- **AI Assistants**: For data access and web automation
- **Automation Tools**: For workflow automation
- **Monitoring Systems**: For business and website monitoring
- **Data Collection**: For web scraping and business analytics

## Support

For detailed documentation:
- **Supabase Server**: See `mcp/README.md`
- **Puppeteer Server**: See `mcp/PUPPETEER_README.md`

For issues:
1. Check server logs
2. Run test scripts
3. Verify configuration
4. Check troubleshooting sections in individual READMEs 