import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import pool from "./db";

const SALT_ROUNDS = 14;
const ADMIN = {
  yes: 1,
  no: 0
};

const generateEmployeeData = () => {
  const DEFAULT_EMPLOYEE_PASSWORD = faker.internet.password({ length: 8 });

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
      date_of_birth: faker.date.birthdate({
        min: 18,
        max: 65,
        mode: "age"
      }),
      start_date: faker.date.past({ years: 10 }),
      position: faker.person.jobTitle(),
      supervisor: faker.person.fullName(),
      salary: faker.string.numeric({ length: { min: 5, max: 7 } }),
      image: faker.image.avatar(),
      isadmin: ADMIN.no,
      isEmployed: true
    };
    employees.push(employee);
  }
  return employees;
};

const generateAdminData = () => {
  const DEFAULT_ADMIN_EMAIL = "admin@cyberconvoy.com";
  const DEFAULT_ADMIN_PASSWORD = "Admin@123";
  const DEFAULT_ADMIN_POSITION = "IT Admin";

  const defaultAdminHashedPassword = bcrypt.hashSync(
    DEFAULT_ADMIN_PASSWORD,
    SALT_ROUNDS
  );

  const admin = [
    {
      admin_id: faker.string.uuid(),
      admin_firstName: faker.person.firstName(),
      admin_lastName: faker.person.lastName(),
      admin_dept: "IT",
      admin_phone: faker.helpers.fromRegExp(
        /([1-9][0-9]{2}) [0-9]{3}-[0-9]{4}/
      ),
      admin_email: DEFAULT_ADMIN_EMAIL,
      admin_password: defaultAdminHashedPassword,
      address: faker.location.streetAddress(),
      admin_date_of_birth: faker.date.birthdate(),
      admin_start_date: faker.date.soon(),
      admin_position: DEFAULT_ADMIN_POSITION,
      admin_supervisor: "",
      admin_salary: faker.string.numeric({ length: { min: 6, max: 7 } }),
      admin_image: faker.image.avatar(),
      isadmin: ADMIN.yes,
      isEmployed: true
    }
  ];
  return admin;
};

const seed = async () => {
  try {
    const connection = await pool.getConnection();

    await connection.query("DROP TABLE IF EXISTS employee");
    await connection.query(`
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
        isadmin BOOLEAN,
        isEmployed BOOLEAN
      )
    `);

    await connection.query("TRUNCATE TABLE employee;");

    const employees = generateEmployeeData();
    await connection.query("INSERT INTO employee VALUES ?", [
      employees.map(employee => Object.values(employee))
    ]);

    const admin = generateAdminData();
    await connection.query("INSERT INTO employee VALUES ?", [
      admin.map(admin => Object.values(admin))
    ]);

    console.log("Seed data inserted successfully");
    connection.release();
  } catch (error) {
    console.error("Error inserting seed data:", error);
  }
};

seed();
