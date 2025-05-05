# LedgerPro - Financial Management System

LedgerPro is a comprehensive financial management system designed to help businesses manage their customers, suppliers, invoices, and transactions efficiently. Built with modern web technologies, it provides a robust and user-friendly interface for financial operations.

## Features

- Customer Management
- Supplier Management
- Invoice Generation and Tracking
- Transaction Management
- Cash Book Management
- Financial Reports
- User Authentication and Authorization
- Responsive Dashboard

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Zustand for state management
- Axios for API communication

### Backend
- Node.js with TypeScript
- Express.js framework
- MongoDB database
- JWT authentication
- RESTful API architecture

## Project Structure

```
LedgerPro/
├── frontend/           # React frontend application
│   ├── src/           # Source files
│   ├── public/        # Static files
│   └── package.json   # Frontend dependencies
│
└── backend/           # Node.js backend application
    ├── src/          # Source files
    └── package.json  # Backend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/chuck-ankit/LedgerPro.git
   cd LedgerPro
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd ../backend
   npm install
   ```

4. Set up environment variables:
   - Create `.env` files in both frontend and backend directories
   - Follow the `.env.example` files for required variables

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Access the application at `http://localhost:5173`

## Development

- Frontend runs on port 5173
- Backend runs on port 5000
- API endpoints are prefixed with `/api`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email ankitkumar9864@gmail.com or create an issue in the repository.
