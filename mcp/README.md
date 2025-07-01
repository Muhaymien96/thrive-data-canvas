# Supabase MCP Server

A comprehensive Model Context Protocol (MCP) server that provides REST API access to your Supabase database for the VentureHub application.

## Features

- **Full CRUD Operations**: Create, read, update, and delete operations for all major entities
- **Business Intelligence**: Analytics endpoints for revenue and stock management
- **Search Functionality**: Cross-entity search capabilities
- **Type Safety**: Full TypeScript support with database type definitions
- **Error Handling**: Comprehensive error handling and validation

## Quick Start

1. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.server` file in the root directory:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Start the MCP server**:
   ```bash
   npm run mcp
   ```

The server will start on `http://localhost:3100`

## API Endpoints

### Health Check
- `GET /health` - Check server status

### Customers
- `GET /customers` - Get all customers (optional: `?business_id=xxx`)
- `GET /customers/:id` - Get specific customer
- `POST /customers` - Create new customer
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

### Businesses
- `GET /businesses` - Get all businesses (optional: `?owner_id=xxx`)
- `GET /businesses/:id` - Get specific business
- `POST /businesses` - Create new business

### Transactions
- `GET /transactions` - Get transactions (filters: `business_id`, `type`, `date_from`, `date_to`)
- `GET /transactions/:id` - Get specific transaction
- `POST /transactions` - Create new transaction
- `PUT /transactions/:id` - Update transaction

### Products
- `GET /products` - Get products (filters: `business_id`, `category`, `supplier_id`)
- `GET /products/:id` - Get specific product
- `POST /products` - Create new product
- `PUT /products/:id` - Update product

### Employees
- `GET /employees` - Get employees (optional: `?business_id=xxx`)
- `POST /employees` - Create new employee

### Suppliers
- `GET /suppliers` - Get suppliers (filters: `business_id`, `category`)
- `POST /suppliers` - Create new supplier

### Analytics
- `GET /analytics/revenue` - Revenue analytics (filters: `business_id`, `date_from`, `date_to`)
- `GET /analytics/stock` - Stock analytics (filters: `business_id`)

### Search
- `GET /search` - Search across entities (params: `q`, `business_id`, `type`)

## Usage Examples

### Get all customers for a business
```bash
curl "http://localhost:3100/customers?business_id=your_business_id"
```

### Create a new customer
```bash
curl -X POST "http://localhost:3100/customers" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "business_id": "your_business_id"
  }'
```

### Get revenue analytics
```bash
curl "http://localhost:3100/analytics/revenue?business_id=your_business_id&date_from=2024-01-01&date_to=2024-12-31"
```

### Search for products
```bash
curl "http://localhost:3100/search?q=laptop&business_id=your_business_id&type=products"
```

## Data Models

The server uses TypeScript types that match your Supabase database schema:

- `Customer` - Customer information
- `Business` - Business details
- `Transaction` - Financial transactions
- `Product` - Product inventory
- `Employee` - Employee records
- `Supplier` - Supplier information
- `Profile` - User profiles

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Adding New Endpoints

1. Add the endpoint to `mcp/mcpServer.ts`
2. Follow the existing pattern for error handling and response formatting
3. Update this README with the new endpoint documentation

### Type Safety

The server uses the `Database` type from `src/types/database.ts` to ensure type safety with your Supabase schema. When the database schema changes, regenerate the types and update the server accordingly.

## Security

- The server uses Supabase service role key for full database access
- All endpoints should be protected in production environments
- Consider implementing authentication middleware for production use

## Troubleshooting

### Common Issues

1. **Connection errors**: Check your Supabase URL and service role key
2. **Type errors**: Ensure your database types are up to date
3. **Port conflicts**: Change the PORT constant in `mcpServer.ts` if 3100 is in use

### Logs

The server logs all requests and errors to the console. Check the terminal output for debugging information 