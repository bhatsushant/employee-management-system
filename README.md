# Employee Management System

This Employee Management System is a comprehensive full-stack application designed for organizations to manage employee records and operations effectively. The system supports user authentication including Google sign-in, and allows for complete CRUD operations on employee data. The frontend is implemented using Vite, React, TypeScript, Shadcn-ui, and Tailwind CSS, while the backend is developed with Express, TypeScript, and MySQL. Firebase is used for authentication processes.

## Features

- **User Authentication:** Support for manual login and Google sign-in.
- **Employee Management:** Capabilities to add, delete, edit, and view detailed profiles of employees.
- **Data Filtering:** Functionalities to filter employees based on their department.
- **Data Sorting:** Functionalities to sort employees based on their first and last names.
- **Data Export:** Ability to export the employee list to a CSV file.
- **Database Seeding:** Includes seed data to populate the database for initial testing.
- **View Admin Profile:** View a short bio of the logged in user by clicking on the profile name and image on the sidebar

## Getting Started

### Working and Usage

A few things to note before testing this project. Currently the application authenticates users using a manual sign in method; details of which have been provided below and a Google sign in. Because of time constraints, there was scope for implementation of only one role which is admin. When successfully authenticated, the user can Add, Edit, Delete and View employees.

### **This app does not delete any records as logically an employee management system only makes an employee inactive after the employee has left the organization. In that sense I have made this app such that the `isEmployed` flag in the employee table is set to 0 once the employee has been deleted from the frontend but the record of an employee is still available to view from the database**

After logging in, users are redirected to the dashboard where they can:

- **View** all employees in a paginated and filterable table.
- **Add** new employees using the navigation bar.
- **Edit** or **Delete** employee details.
- **Export** employee data as a CSV file.

### Here are the login details for the admin user

```
email: admin@cyberconvoy.com
password: Admin@123
```

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) installed.
- [MySQL](https://dev.mysql.com/downloads/mysql/) set up and running.
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) (optional, for database management). (MySQL Workbench 8.0 CE)
- [Firebase](https://firebase.google.com/docs/web/setup) project set up for authentication.

### Backend Setup

1. **Navigate to the Server Directory:**

   ```bash
   cd server
   ```

   Note that this project requires npm version ^18.18 because of some packages. Download this version or use a tool like `nvm` to update already existing version

1. **Install Dependencies:**

   ```bash
   npm install
   ```

1. **Environment Configuration:**

   - Copy the contents of `envexample.md` file to `.env`.
   - Update the `.env` file with your MySQL credentials and other configurations as shown in the encexample.md file.
   - Note that the envexample.md file also contains keys like `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `SESSION_SECRET` which are not required for your DB connection but are required for your code. You can assign any random values for these keys for the purposes of testing.

1. **Create Database:**

   ```bash
   npm run createdb
   ```

1. **Database Seeding:**

   ```bash
   npm run seed
   ```

1. **Running the Server Continuously:**
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

   - Ensure that your Firebase keys are set up correctly in `.env` as per the `envexample.md` provided in the folder. Copy it's contents to your `.env` file and update your keys which are provided by Firebase after creating a Web Application Project

4. **Running the Client Development Server:**
   ```bash
   npm run dev
   ```
   - Access the web application by navigating to `http://localhost:5173`.

### Future Enhancements

This product can be further improved by adding features like

1. **Analytical Dashboard** - Update the dashboard to include graphs and bar charts to view details like employee count, number of employeed employees, average salary etc.
2. **Delete By ID**: Delete an employee based on their ID
3. **Search By ID**: Search an employee by ID
4. **Access Control**: Make or remove other users admin by providing an option on the frontend for the admin user
5. **Theme toggle**: Ability to change the product theme to Light or Dark

## Contributing

Contributions are welcome. Please fork the repository and submit a pull request with your updates.

## Acknowledgements

- [React Documentation](https://react.dev/blog/2023/03/16/introducing-react-dev)
- [Express.js](https://expressjs.com/)
- [Firebase](https://firebase.google.com/docs)
- [Vite.js](https://vitejs.dev/guide/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
