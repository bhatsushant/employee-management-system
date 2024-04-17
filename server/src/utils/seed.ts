import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import db from "./db";

const SALT_ROUNDS = 14;
const ADMIN = {
  yes: 1,
  no: 0
};

const generateEmployeeData = () => {
  const DEFAULT_EMPLOYEE_PASSWORD = "password123";

  const defaultEmployeeHashedPassword = bcrypt.hashSync(
    DEFAULT_EMPLOYEE_PASSWORD,
    SALT_ROUNDS
  );

  const employees = [];
  for (let i = 0; i < 50; i++) {
    const employee = {
      emp_id: faker.string.uuid(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      dept: faker.helpers.arrayElement([
        "IT",
        "HR",
        "Finance",
        "Marketing",
        "Operations"
      ]),
      phone: faker.helpers.fromRegExp(/([1-9][0-9]{2}) [0-9]{3}-[0-9]{4}/),
      email: faker.internet.email().toLowerCase(),
      password: defaultEmployeeHashedPassword,
      address: faker.location.streetAddress(),
      date_of_birth: faker.date.birthdate(),
      start_date: faker.date.soon(),
      position: faker.person.jobTitle(),
      supervisor: faker.person.fullName(),
      salary: faker.string.numeric({ length: { min: 5, max: 7 } }),
      image: faker.image.avatar(),
      isadmin: ADMIN.no
    };
    employees.push(employee);
  }
  return employees;
};

const generateAdminData = () => {
  const DEFAULT_ADMIN_EMAIL = "admin@gmail.com";
  const DEFAULT_ADMIN_PASSWORD = "admin123";

  const defaultAdminHashedPassword = bcrypt.hashSync(
    DEFAULT_ADMIN_PASSWORD,
    SALT_ROUNDS
  );

  return {
    admin_id: faker.string.uuid(),
    admin_firstName: faker.person.firstName(),
    admin_lastName: faker.person.lastName(),
    admin_email: DEFAULT_ADMIN_EMAIL,
    admin_password: defaultAdminHashedPassword,
    isadmin: ADMIN.yes
  };
};

const seed = () => {
  try {
    db.query(`DROP TABLE IF EXISTS employee`);
    db.query(`
      CREATE TABLE IF NOT EXISTS employee (
        emp_id VARCHAR(150) PRIMARY KEY,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        dept VARCHAR(255),
        phone VARCHAR(20),
        email VARCHAR(255),
        password VARCHAR(255),
        address VARCHAR(255),
        date_of_birth DATE,
        start_date DATE,
        position VARCHAR(255),
        supervisor VARCHAR(255),
        salary DECIMAL(10, 2),
        image VARCHAR(255),
        isadmin BOOLEAN
      )
    `);

    db.query("TRUNCATE TABLE employee;");

    const employees = generateEmployeeData();

    db.query("INSERT INTO employee VALUES ?", [
      employees.map(employee => Object.values(employee))
    ]);

    const admin = generateAdminData();

    db.query(
      "INSERT INTO employee (emp_id, first_name, last_name, email, password, isadmin) VALUES (?, ?, ?, ?, ?, ?)",
      Object.values(admin)
    );

    console.log("Seed data inserted successfully");
  } catch (error) {
    console.error("Error inserting seed data:", error);
  } finally {
    db.end();
  }
};

seed();
