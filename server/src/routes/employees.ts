import { config } from "dotenv";
config();
import e, { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import pool from "../utils/db";
import * as validations from "../utils/validations";
import { mapEmployeeFields } from "../utils/mapEmployee";
import { FieldPacket, RowDataPacket } from "mysql2/promise";

const router = Router();

export interface IEmployee {
  first_name: string;
  last_name: string;
  dept: string;
  phone: string;
  email: string;
  password: string;
  address: string;
  date_of_birth: string;
  start_date: string;
  position: string;
  supervisor: string;
  salary: number;
  image: string;
}

const SALT_ROUNDS = 14;
const ADMIN = {
  yes: 1,
  no: 0
};
router
  .route("/")
  .get(async (req: Request, res: Response) => {
    try {
      const sql = "SELECT * FROM employee where isAdmin = 0";
      const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.execute(sql);

      const employees = rows.map(employee => ({
        employeeId: employee.emp_id,
        firstName: employee.first_name,
        lastName: employee.last_name,
        department: employee.dept,
        phoneNumber: employee.phone,
        email: employee.email,
        address: employee.address,
        dateOfBirth: employee.date_of_birth,
        startDate: employee.start_date,
        position: employee.position,
        supervisor: employee.supervisor,
        salary: employee.salary,
        image: employee.image,
        isAdmin: employee.isadmin,
        isEmployed: employee.isEmployed
      }));
      return res.status(200).json(employees);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  })

  .post(async (req: Request, res: Response) => {
    try {
      const reqEmployee = req.body;

      reqEmployee.email = reqEmployee.email.toLowerCase();

      validations.isEmail(reqEmployee.email);
      validations.isStringEmpty(reqEmployee.firstName, "first name");
      validations.isStringEmpty(reqEmployee.lastName, "last name");
      validations.isStringEmpty(reqEmployee.department, "department");
      validations.isStringEmpty(reqEmployee.address, "address");

      validations.isPhoneValid(reqEmployee.phoneNumber);

      validations.isStringEmpty(reqEmployee.position, "position");

      validations.isStringEmpty(reqEmployee.supervisor, "supervisor");

      validations.isNumberValid(reqEmployee.salary, "salary");

      validations.isDateValid(reqEmployee.dateOfBirth);

      validations.isDateValid(reqEmployee.startDate);

      // validations.isStringEmpty(reqEmployee.image, "image");

      // Check for duplicate email
      const checkSql = "SELECT email FROM employee WHERE email = ?";
      const [checkResult]: [RowDataPacket[], FieldPacket[]] = await pool.query(
        checkSql,
        [reqEmployee.email]
      );

      if (checkResult.length > 0) {
        return res.status(400).json({
          status: false,
          message: "Employee with given email already exists"
        });
      }

      // Proceed with further operations if no error occurred
      const mappedEmployee = mapEmployeeFields(reqEmployee);
      const {
        first_name,
        last_name,
        dept,
        phone,
        email,
        address,
        date_of_birth,
        start_date,
        salary,
        position,
        supervisor,
        image
      } = mappedEmployee;

      const sql =
        "INSERT INTO employee (emp_id, first_name, last_name, dept, phone, email, password, address, date_of_birth, start_date, position, supervisor, salary, image, isadmin,isEmployed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const hashedPassword = bcrypt.hashSync("password@123", SALT_ROUNDS);
      const employee = [
        uuidv4(),
        first_name,
        last_name,
        dept,
        phone,
        email,
        hashedPassword,
        address,
        date_of_birth,
        start_date,
        position,
        supervisor,
        salary,
        image,
        ADMIN.no,
        1
      ];

      const [result] = await pool.query(sql, employee);

      return res.status(200).json({
        data: result,
        status: true,
        message: "Employee created successfully"
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: false,
        message: error
      });
    }
  });

router
  .route("/:id")
  .get(async (req: Request, res: Response) => {
    const { id } = req.params;

    validations.isStringEmpty(id, "employee id");

    try {
      const sql = "SELECT * FROM employee WHERE emp_id = ? LIMIT 1";
      const [result]: [RowDataPacket[], FieldPacket[]] = await pool.query(sql, [
        id
      ]);

      if (result.length === 0) {
        return res
          .status(404)
          .json({ status: false, message: "Employee not found" });
      }

      return res.status(200).json(result[0]);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ status: false, message: "Internal server error" });
    }
  })
  // Update employee
  .put(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const employeeData = req.body;

      // Data validation (assuming validations is a separate module)
      validations.isEmail(employeeData.email);
      validations.isStringEmpty(employeeData.firstName, "first name");
      validations.isStringEmpty(employeeData.lastName, "last name");
      validations.isStringEmpty(employeeData.department, "department");
      validations.isStringEmpty(employeeData.address, "address");
      validations.isPhoneValid(employeeData.phoneNumber);
      validations.isStringEmpty(employeeData.position, "position");
      validations.isStringEmpty(employeeData.supervisor, "supervisor");
      validations.isNumberValid(employeeData.salary, "salary");
      validations.isDateValid(employeeData.dateOfBirth);
      validations.isDateValid(employeeData.startDate);
      validations.isStringEmpty(employeeData.image, "image");

      // Check if employee exists before updating
      const checkSql = "SELECT email FROM employee WHERE emp_id = ? LIMIT 1;";

      try {
        const [result]: [RowDataPacket[], FieldPacket[]] = await pool.query(
          checkSql,
          [id]
        );

        if (result.length === 0) {
          return res
            .status(404)
            .json({ status: false, message: "Employee not found" });
        }

        const isAdmin = result[0].isAdmin === ADMIN.yes; // Check admin status

        if (isAdmin) {
          return res.status(403).json({
            status: false,
            message: "Invalid Request (Admin cannot be updated)"
          });
        }

        // Prepare sanitized employee data for update
        const employee = {
          firstName: employeeData.firstName,
          lastName: employeeData.lastName,
          department: employeeData.department,
          phone: employeeData.phoneNumber,
          email: employeeData.email.toLowerCase(), // Ensure email is lowercase
          address: employeeData.address,
          dateOfBirth: employeeData.dateOfBirth,
          startDate: employeeData.startDate,
          position: employeeData.position,
          supervisor: employeeData.supervisor,
          salary: parseInt(employeeData.salary),
          image: employeeData.image,
          isAdmin: false, // Set isAdmin to false (not updatable)
          isEmployed: 1 // Set isEmployed to 1 (assuming active status)
        };

        const sql =
          "UPDATE employee SET first_name = ?, last_name = ?, dept = ?, phone = ?, email = ?, address = ?, date_of_birth = ?, start_date = ?, position = ?, supervisor = ?, salary = ?, image = ?, isAdmin = ?, isEmployed = ? WHERE emp_id = ?";

        const [updated] = await pool.query(sql, [
          employee.firstName,
          employee.lastName,
          employee.department,
          employee.phone,
          employee.email,
          employee.address,
          employee.dateOfBirth,
          employee.startDate,
          employee.position,
          employee.supervisor,
          employee.salary,
          employee.image,
          employee.isAdmin,
          employee.isEmployed,
          id
        ]);

        return res.status(200).json({
          status: true,
          message: "Employee updated successfully"
        });
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .json({ status: false, message: "Internal server error" });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: false, message: "Internal server error" });
    }
  });

// Delete employee

router.put("/delete_employee/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  validations.isStringEmpty(id, "employee id");

  try {
    // Check if employee exists
    const checkQuery =
      "SELECT emp_id, isadmin FROM employee WHERE emp_id = ? LIMIT 1";
    const [checkResult]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      checkQuery,
      [id]
    );

    if (!checkResult.length) {
      return res
        .status(404)
        .json({ status: false, message: "Employee not found" });
    }

    // Update employee status
    const updateSql = "UPDATE employee SET isEmployed = ? WHERE emp_id = ?";
    const [updateResult] = await pool.query(updateSql, [0, id]);

    return res.status(200).json({
      status: true,
      message: "Employee deleted successfully"
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
});

// image upload
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

export default router;
