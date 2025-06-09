# HIPAA-Compliant Call Center Web App

A secure web application for managing call center operations, designed to be HIPAA-compliant and optimized for both mobile and desktop use.

## Features

- Secure user authentication with role-based access
- Call entry and categorization system
- End-of-shift report viewer
- Client communication module
- Admin dashboard
- HIPAA-compliant security features

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd hipaa-call-center
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Firebase configuration:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Running the Application

To start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Building for Production

To create a production build:

```bash
npm run build
```

## Security Considerations

This application is designed to be HIPAA-compliant. Key security features include:

- Encrypted data at rest and in transit
- Role-based access control
- Audit logging
- Secure authentication
- HIPAA-compliant hosting infrastructure

## License

[Your License Here] 