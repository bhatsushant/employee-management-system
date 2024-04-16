import { faker } from "@faker-js/faker";
import db from "./db";
import RandExp from "randexp";

const generateEmployeeData = () => {
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
      phone: faker.helpers.fromRegExp(/^\([2-9][\d]{2}\) [\d]{3}-[\d]{4}$/),
      email: faker.internet.email(),
      password: faker.internet.password(),
      address: faker.location.streetAddress(),
      image: faker.image.avatar(),
      isadmin: faker.datatype.boolean()
    };
    employees.push(employee);
  }
  return employees;
};

// const generateDepartmentData = () => {
//   const departments = [];
//   for (let i = 0; i < 5; i++) {
//     const department = {
//       dept_id: faker.string.uuid(),
//       dept_name: faker.commerce.department()
//     };
//     departments.push(department);
//   }
//   return departments;
// };

const generateAdminData = () => {
  return {
    admin_id: faker.string.uuid(),
    admin_firstName: faker.person.firstName(),
    admin_lastName: faker.person.lastName(),
    admin_email: faker.internet.email(),
    admin_password: faker.internet.password(),
    isAdmin: faker.datatype.boolean(1)
  };
};

const seed = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS employee (
        emp_id VARCHAR(150) PRIMARY KEY,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        dept VARCHAR(255),
        phone VARCHAR(20),
        email VARCHAR(255),
        password VARCHAR(255),
        address VARCHAR(255),
        image VARCHAR(255),
        isadmin BOOLEAN
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS department (
        dept_id VARCHAR(150) PRIMARY KEY,
        dept_name VARCHAR(255)
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS admin (
        admin_id VARCHAR(150) PRIMARY KEY,
        admin_firstName VARCHAR(255),
        admin_lastName VARCHAR(255),
        admin_email VARCHAR(255),
        admin_password VARCHAR(255),
        isAdmin BOOLEAN
      )
    `);

    const employees = generateEmployeeData();

    // const departments = generateDepartmentData();

    // await db.query("INSERT INTO department (dept_id, dept_name) VALUES ?", [
    //   departments.map(department => Object.values(department))
    // ]);

    await db.query(
      "INSERT INTO employee (emp_id, first_name, last_name, dept, phone, email, password, address, image, isadmin) VALUES ?",
      [employees.map(employee => Object.values(employee))]
    );

    const admin = generateAdminData();

    await db.query(
      "INSERT INTO admin (admin_id, admin_firstName, admin_lastName, admin_email, admin_password, isAdmin) VALUES (?, ?, ?, ?, ?, ?)",
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
