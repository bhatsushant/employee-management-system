import { config } from "dotenv";
config();
import e, { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import db from "../utils/db";
import * as validations from "../utils/validations";
import { mapEmployeeFields } from "../utils/mapEmployee";

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
  .get((req: Request, res: Response) => {
    const sql = "SELECT * FROM employee where isAdmin = 0";

    db.query(sql, (err, result) => {
      try {
        if (err) {
          return res.status(500).json({ error: "Internal server error" });
        }
        const employees: any = [];
        result.forEach((employee: any) => {
          employees.push({
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
          });
        });
        return res.status(200).json(employees);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      }
    });
  })
  .post((req: Request, res: Response) => {
    let employee = req.body;
    employee.salary = parseInt(employee.salary);
    employee.email = employee.email.toLowerCase();

    validations.isEmail(employee.email);
    validations.isStringEmpty(employee.firstName, "first name");
    validations.isStringEmpty(employee.lastName, "last name");
    validations.isStringEmpty(employee.department, "department");
    validations.isStringEmpty(employee.address, "address");
    validations.isPhoneValid(employee.phoneNumber);
    validations.isStringEmpty(employee.position, "position");
    validations.isStringEmpty(employee.supervisor, "supervisor");
    validations.isNumberValid(employee.salary, "salary");
    validations.isDateValid(employee.dateOfBirth);
    validations.isDateValid(employee.startDate);
    validations.isStringEmpty(employee.image, "image");

    // Check for duplicate email
    const checkSql = "SELECT email FROM employee WHERE email = ? LIMIT 1;";

    db.query(checkSql, [employee.email], (err, result) => {
      try {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Internal server error"
          });
        }
        console.log(result);
        if (result.length > 0) {
          return res.status(400).json({
            status: false,
            message: "Employee with given email already exists" + err!.message
          });
        }
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          status: false,
          message: "Internal server error"
        });
      }
    });

    const mappedEmployee = mapEmployeeFields(employee);

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
    try {
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

      db.query(sql, [...employee], (err, result) => {
        if (err) {
          return res.status(400).json({ status: false, message: err });
        }

        return res.status(200).json({
          status: true,
          message: "Employee added successfully"
        });
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error });
      return error;
    }
  });

router
  .route("/:id")
  .get((req: Request, res: Response) => {
    const { id } = req.params;

    validations.isStringEmpty(id, "employee id");

    const sql = "SELECT * FROM employee WHERE emp_id = ? LIMIT 1";

    db.query(sql, [id], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ status: false, message: "Internal server error" });
      }

      if (result.length === 0) {
        return res
          .status(404)
          .json({ status: false, message: "Employee not found" });
      }

      return res.status(200).json(result[0]);
    });
  })
  // Update employee
  .put((req: Request, res: Response) => {
    const { id } = req.params;
    let employee = req.body;
    console.log("employee api", employee);

    employee.salary = parseInt(employee.salary);
    employee.email = employee.email.toLowerCase();

    validations.isEmail(employee.email);
    validations.isStringEmpty(employee.firstName, "first name");
    validations.isStringEmpty(employee.lastName, "last name");
    validations.isStringEmpty(employee.department, "department");
    validations.isStringEmpty(employee.address, "address");
    validations.isPhoneValid(employee.phoneNumber);
    validations.isStringEmpty(employee.position, "position");
    validations.isStringEmpty(employee.supervisor, "supervisor");
    validations.isNumberValid(employee.salary, "salary");
    validations.isDateValid(employee.dateOfBirth);
    validations.isDateValid(employee.startDate);
    validations.isStringEmpty(employee.image, "image");

    // Check if employee exists before updating
    const checkSql = "SELECT email FROM employee WHERE emp_id = ? LIMIT 1;";

    db.query(checkSql, [id], (err, result) => {
      try {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Internal server error"
          });
        }

        if (result.length === 0) {
          return res
            .status(404)
            .json({ status: false, message: "Employee not found" });
        }

        const { isadmin } = result[0];

        if (isadmin === ADMIN.yes) {
          return res
            .status(403)
            .json({ status: false, message: "Invalid Request" });
        }
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ status: false, message: "Internal server error" });
      }
    });

    const mappedEmployee = mapEmployeeFields(employee);
    console.dir("mapped", mappedEmployee);

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
      "UPDATE employee SET first_name = ?, last_name = ?, dept = ?, phone = ?, email = ?, address = ?, date_of_birth = ?, start_date = ?, position = ?, supervisor = ?, salary = ?, image = ?, isAdmin = ?, isEmployed = ? WHERE emp_id = ?";

    try {
      const employee = [
        first_name,
        last_name,
        dept,
        phone,
        email,
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

      db.query(sql, [...employee, id], err => {
        if (err) {
          return res.status(400).json({ status: false, message: err });
        }

        return res.status(200).json({
          status: true,
          message: "Employee updated successfully"
        });
      });
    } catch (error) {
      console.log(error);
    }
  });

// Delete employee
router.put("/delete_employee/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  validations.isStringEmpty(id, "employee id");

  // Check if employee exists
  const checkSql =
    "SELECT emp_id, isadmin FROM employee WHERE emp_id = ? LIMIT 1";

  db.query(checkSql, [id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ status: false, message: "Internal server error" });
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Employee not found" });
    }

    const sql = "UPDATE employee SET isEmployed = ? WHERE emp_id = ?";
    db.query(sql, [0, id], (err, result) => {
      if (err) {
        return res.status(400).json({ status: false, message: err });
      }

      return res.status(200).json({
        status: true,
        message: "Employee deleted successfully"
      });
    });
  });
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
