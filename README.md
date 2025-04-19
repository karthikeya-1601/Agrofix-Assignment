# Agrofix Frontend

A React.js application for a bulk fruit and vegetable ordering system.

## Overview

This frontend application provides interfaces for:
- Browsing available products
- Placing bulk orders
- Tracking order status
- Admin dashboard for managing orders and products

## Installation

1. Clone the repository or create a new project directory
2. Copy these files into your project
3. Install dependencies:

```bash
npm install react react-dom axios
```

## Project Structure

- `src/components/`: Contains all React components
- `src/services/`: Contains API service for backend communication
- `src/App.jsx`: Main application component with simple routing
- `src/styles.css`: Global styles

## Key Features

- **Product Catalog**: Display available fruits and vegetables
- **Order Form**: Allow customers to place bulk orders
- **Order Tracking**: Let customers check their order status
- **Admin Dashboard**: Manage orders and products

## Backend Integration

This frontend is designed to work with your existing backend. The API service (`src/services/api.js`) is configured to connect to your backend API endpoints. Make sure to update the `API_URL` in this file to match your backend server address.

## Running the Application

```bash
npm start
```

## Admin Mode

For demo purposes, there's an "Enter Admin Mode" button at the bottom right of the screen. In a production environment, this would be replaced with proper authentication.

## Customization

- Edit the CSS in `src/styles.css` to match your branding
- Modify the components as needed for additional functionality

## Notes

- This implementation focuses on core functionality as requested, keeping the code length minimal
- Optional features like authentication have been excluded as per requirements

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Bulk Order API – Backend
This is the backend server for AgroFix, designed to manage bulk vegetable and fruit orders efficiently.

Built with Express.js, connected to a simple in-memory (mock) database.
## Structure
![image](https://github.com/user-attachments/assets/c8c235ff-02ee-4fa8-8f3d-473961f34e57)

