# LedgerPro Backend

This is the backend service for the LedgerPro Business Ledger Management System. It provides a RESTful API for managing customers, invoices, and other business operations.

## Features

- JWT-based authentication
- Customer management
- Invoice management
- Supplier management
- Cashbook tracking
- Reports generation
- User preferences and settings

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ledgerpro.git
cd ledgerpro/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ledgerpro
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## Development

To start the development server with hot-reload:

```bash
npm run dev
```

## Building for Production

1. Build the TypeScript code:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## API Documentation

### Authentication

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/forgot-password` - Request password reset
- POST `/api/auth/reset-password` - Reset password

### Customers

- GET `/api/customers` - Get all customers
- POST `/api/customers` - Create a new customer
- GET `/api/customers/:id` - Get a specific customer
- PATCH `/api/customers/:id` - Update a customer
- DELETE `/api/customers/:id` - Delete a customer

### Invoices

- GET `/api/invoices` - Get all invoices
- POST `/api/invoices` - Create a new invoice
- GET `/api/invoices/:id` - Get a specific invoice
- PATCH `/api/invoices/:id` - Update an invoice
- DELETE `/api/invoices/:id` - Delete an invoice
- GET `/api/invoices/stats` - Get invoice statistics

## Error Handling

The API uses a consistent error response format:

```json
{
  "status": "error",
  "message": "Error message here"
}
```

## Security

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS enabled
- Helmet security headers
- Input validation
- MongoDB query sanitization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 