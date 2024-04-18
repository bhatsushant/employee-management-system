# Employee Management System

This Employee Management System is a comprehensive full-stack application designed for organizations to manage employee records and operations effectively. The system supports user authentication including Google sign-in, and allows for complete CRUD operations on employee data. The frontend is implemented using Vite, React, TypeScript, Shadcn-ui, and Tailwind CSS, while the backend is developed with Express, TypeScript, and MySQL. Firebase is used for authentication processes.

## Features

- **User Authentication:** Support for manual login and Google sign-in.
- **Employee Management:** Capabilities to add, delete, edit, and view detailed profiles of employees.
- **Data Filtering:** Functionalities to filter employees based on their department.
- **Data Sorting:** Functionalities to sort employees based on their first and last names.
- **Data Export:** Ability to export the employee list to a CSV file.
- **Database Seeding:** Includes seed data to populate the database for initial testing.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) installed.
- [MySQL](https://dev.mysql.com/downloads/mysql/) set up and running.
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) (optional, for database management).
- A Firebase project set up for authentication.

### Backend Setup

1. **Navigate to the Server Directory:**

   ```bash
   cd server
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Environment Configuration:**

   - Copy the `.env.example` file to `.env`.
   - Update the `.env` file with your MySQL credentials and other configurations.

4. **Database Seeding:**

   ```bash
   npm run seed
   ```

5. **Running the Server Continuously:**
   ```bash
   npm run dev
   ```
   - This command uses `tsx` to watch for changes and keep the server running without crashing.

### Frontend Setup

1. **Navigate to the Client Directory:**

   ```bash
   cd client
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Firebase Configuration:**

   - Ensure that your Firebase keys are set up correctly in `.env.local` as per the `.env.example`.

4. **Running the Client Development Server:**
   ```bash
   npm run dev
   ```
   - Access the web application by navigating to `http://localhost:5173`.

## Usage

After logging in, users are redirected to the dashboard where they can:

- **View** all employees in a paginated and filterable table.
- **Add** new employees.
- **Edit** or **Delete** employee details.
- **Export** employee data as a CSV file.

## Contributing

Contributions are welcome. Please fork the repository and submit a pull request with your updates.

## Acknowledgements

- [React Documentation](https://react.dev/blog/2023/03/16/introducing-react-dev)
- [Express.js](https://expressjs.com/)
- [Firebase](https://firebase.google.com/docs)
- [Vite.js](https://vitejs.dev/guide/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
