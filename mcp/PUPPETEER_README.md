# Puppeteer MCP Server

A comprehensive Model Context Protocol (MCP) server that provides web automation, scraping, and browser control capabilities using Puppeteer.

## Features

- **Screenshot Generation**: Capture screenshots of web pages
- **PDF Generation**: Convert web pages to PDF documents
- **Web Scraping**: Extract data from web pages using CSS selectors
- **Form Submission**: Automate form filling and submission
- **Performance Monitoring**: Measure page load times and performance metrics
- **Browser Automation**: Execute complex browser automation workflows
- **Headless Operation**: Run browser operations without GUI

## Quick Start

1. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Start the Puppeteer MCP server**:
   ```bash
   npm run mcp:puppeteer
   ```

The server will start on `http://localhost:3101`

3. **Verify installation**:
   ```bash
   curl http://localhost:3101/health
   ```

## API Endpoints

### Health Check
- `GET /health` - Check server status

### Screenshot Generation
- `POST /screenshot` - Take screenshots of web pages

**Request Body:**
```json
{
  "url": "https://example.com",
  "width": 1920,
  "height": 1080,
  "fullPage": false,
  "waitFor": 2000
}
```

**Response:** PNG image data

### PDF Generation
- `POST /pdf` - Generate PDF from web pages

**Request Body:**
```json
{
  "url": "https://example.com",
  "format": "A4",
  "landscape": false,
  "margin": "1cm"
}
```

**Response:** PDF document data

### Web Scraping
- `POST /scrape` - Extract data from web pages

**Request Body:**
```json
{
  "url": "https://example.com",
  "selectors": [
    {
      "name": "title",
      "css": "h1",
      "type": "text"
    },
    {
      "name": "links",
      "css": "a",
      "type": "multiple"
    },
    {
      "name": "image",
      "css": "img",
      "type": "attribute",
      "attribute": "src"
    }
  ],
  "waitFor": 1000
}
```

**Response:**
```json
{
  "data": {
    "title": "Example Domain",
    "links": ["Link 1", "Link 2"],
    "image": "https://example.com/image.jpg"
  }
}
```

### Form Submission
- `POST /submit-form` - Fill and submit forms

**Request Body:**
```json
{
  "url": "https://example.com/form",
  "formData": [
    {
      "selector": "input[name='username']",
      "value": "testuser",
      "type": "input"
    },
    {
      "selector": "select[name='country']",
      "value": "US",
      "type": "select"
    },
    {
      "selector": "input[name='newsletter']",
      "value": true,
      "type": "checkbox"
    }
  ],
  "waitFor": 2000
}
```

### Performance Monitoring
- `POST /performance` - Monitor page performance

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "loadTime": 1250,
  "metrics": {
    "Documents": 1,
    "Frames": 1,
    "JSEventListeners": 0,
    "Nodes": 15,
    "LayoutCount": 1,
    "RecalcStyleCount": 1,
    "LayoutDuration": 0.001,
    "RecalcStyleDuration": 0.001,
    "ScriptDuration": 0.001,
    "TaskDuration": 0.001,
    "JSHeapUsedSize": 1000000,
    "JSHeapTotalSize": 2000000
  },
  "performance": {
    "domContentLoaded": 500,
    "loadComplete": 1200,
    "firstPaint": 800,
    "firstContentfulPaint": 850
  }
}
```

### Browser Automation
- `POST /automate` - Execute complex automation workflows

**Request Body:**
```json
{
  "url": "https://example.com",
  "actions": [
    {
      "type": "click",
      "selector": "button[type='submit']",
      "wait": 1000
    },
    {
      "type": "type",
      "selector": "input[name='search']",
      "value": "test query"
    },
    {
      "type": "wait",
      "wait": 2000
    },
    {
      "type": "screenshot"
    },
    {
      "type": "getText",
      "selector": ".results"
    }
  ]
}
```

## Usage Examples

### Take a Screenshot
```bash
curl -X POST "http://localhost:3101/screenshot" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "width": 1200,
    "height": 800,
    "fullPage": false
  }' \
  --output screenshot.png
```

### Generate PDF
```bash
curl -X POST "http://localhost:3101/pdf" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "format": "A4",
    "landscape": false
  }' \
  --output document.pdf
```

### Scrape Website Data
```bash
curl -X POST "http://localhost:3101/scrape" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://news.ycombinator.com",
    "selectors": [
      {
        "name": "titles",
        "css": ".titleline > a",
        "type": "multiple"
      },
      {
        "name": "points",
        "css": ".score",
        "type": "multiple"
      }
    ]
  }'
```

### Automate Form Submission
```bash
curl -X POST "http://localhost:3101/submit-form" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://httpbin.org/forms/post",
    "formData": [
      {
        "selector": "input[name=\"custname\"]",
        "value": "John Doe",
        "type": "input"
      },
      {
        "selector": "input[name=\"custtel\"]",
        "value": "123-456-7890",
        "type": "input"
      }
    ]
  }'
```

## Selector Types

### Text Extraction
```json
{
  "name": "title",
  "css": "h1",
  "type": "text"
}
```

### Attribute Extraction
```json
{
  "name": "image_url",
  "css": "img",
  "type": "attribute",
  "attribute": "src"
}
```

### HTML Content
```json
{
  "name": "content",
  "css": ".article-content",
  "type": "html"
}
```

### Multiple Elements
```json
{
  "name": "links",
  "css": "a",
  "type": "multiple"
}
```

## Action Types

### Click
```json
{
  "type": "click",
  "selector": "button[type='submit']"
}
```

### Type
```json
{
  "type": "type",
  "selector": "input[name='search']",
  "value": "search term"
}
```

### Wait
```json
{
  "type": "wait",
  "wait": 2000
}
```

### Wait for Selector
```json
{
  "type": "waitForSelector",
  "selector": ".loading-complete"
}
```

### Screenshot
```json
{
  "type": "screenshot"
}
```

### Get Text
```json
{
  "type": "getText",
  "selector": ".result"
}
```

### Navigate
```json
{
  "type": "navigate",
  "value": "https://example.com/page2"
}
```

## Testing

### Run Endpoint Tests
```bash
npm run mcp:puppeteer:test
```

This will test all available endpoints and report their status.

## Configuration

The server uses the same configuration as the main MCP server but runs on port 3101. You can customize:

- **Port**: Change `PORT = config.port + 1` in `puppeteerServer.ts`
- **Browser Options**: Modify the `puppeteer.launch()` options
- **Timeout Settings**: Adjust wait times and timeouts

## Browser Options

The server launches browsers with these default options:
```javascript
{
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
}
```

## Error Handling

All endpoints return consistent error responses:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (missing URL, invalid selectors)
- `500` - Internal Server Error

## Security Considerations

- **Sandbox Disabled**: The server runs with `--no-sandbox` for compatibility
- **Headless Mode**: Browsers run in headless mode by default
- **Resource Management**: Browsers are properly closed after each operation
- **Input Validation**: All inputs are validated before processing

## Troubleshooting

### Common Issues

1. **Browser Launch Failures**
   - Ensure Puppeteer is properly installed
   - Check system dependencies (Chrome/Chromium)
   - Verify sandbox settings

2. **Timeout Errors**
   - Increase `waitFor` values
   - Check network connectivity
   - Verify target URLs are accessible

3. **Selector Errors**
   - Verify CSS selectors are correct
   - Check if elements exist on the page
   - Use browser dev tools to test selectors

4. **Memory Issues**
   - Browsers are automatically closed after each operation
   - Monitor server memory usage
   - Restart server if needed

### Performance Tips

1. **Optimize Screenshots**
   - Use appropriate viewport sizes
   - Set `fullPage: false` when possible
   - Minimize `waitFor` times

2. **Efficient Scraping**
   - Use specific CSS selectors
   - Limit the number of selectors per request
   - Cache results when possible

3. **Browser Management**
   - The server creates a new browser instance for each request
   - Consider implementing browser pooling for high-volume usage

## Development

### Adding New Features

1. Add new endpoints to `mcp/puppeteerServer.ts`
2. Follow the existing pattern for error handling
3. Update this README with new endpoint documentation
4. Add tests to `mcp/test-puppeteer.js`

### Custom Browser Options

You can modify browser launch options in each endpoint:
```javascript
browser = await puppeteer.launch({ 
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  // Add custom options here
});
```

## Integration

The Puppeteer MCP server can be integrated with:
- **AI Assistants**: For web research and data extraction
- **Automation Tools**: For workflow automation
- **Monitoring Systems**: For website monitoring
- **Data Collection**: For web scraping projects

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the server logs
3. Test individual endpoints
4. Verify browser installation and dependencies 