import { config } from "dotenv";
config();
import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import db from "../utils/db";
import * as validations from "../utils/validations";

const router = Router();

interface IEmployee {
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
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.status(200).json(result);
    });
  })
  .post((req: Request, res: Response) => {
    let { salary } = req.body;
    let {
      first_name,
      last_name,
      dept,
      phone,
      email,
      password,
      address,
      date_of_birth,
      start_date,
      position,
      supervisor,
      image
    }: IEmployee = req.body;

    salary = parseInt(salary);
    email = email.toLowerCase();

    validations.isEmail(email);
    validations.isStringEmpty(first_name, "first name");
    validations.isStringEmpty(last_name, "last name");
    validations.isStringEmpty(dept, "department");
    validations.isStringEmpty(address, "address");
    validations.isPasswordValid(password);
    validations.isPhoneValid(phone);
    validations.isStringEmpty(position, "position");
    validations.isStringEmpty(supervisor, "supervisor");
    validations.isNumberValid(salary, "salary");
    validations.isDateValid(date_of_birth);
    validations.isDateValid(start_date);
    validations.isStringEmpty(image, "image");

    // Check for duplicate email
    const checkSql = "SELECT email FROM employee WHERE email = ? LIMIT 1;";

    db.query(checkSql, [email], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ status: false, message: "Internal server error" });
      }

      if (result.length > 0) {
        return res.status(400).json({
          status: false,
          message: "Employee with given email already exists" + err!.message
        });
      }
    });

    const sql =
      "INSERT INTO employee (emp_id, first_name, last_name, dept, phone, email, password, address, date_of_birth, start_date, position, supervisor, salary, image, isadmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    try {
      const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);

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
        ADMIN.no
      ];

      db.query(sql, [...employee], (err, result) => {
        if (err) {
          return res.status(400).json({ status: false, message: err });
        }

        return res
          .status(200)
          .json({ status: true, message: "Employee added successfully" });
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error });
      return error;
    }
  });

// Update employee
router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  let { salary } = req.body;
  let {
    first_name,
    last_name,
    dept,
    phone,
    email,
    password,
    address,
    date_of_birth,
    start_date,
    position,
    supervisor,
    image
  }: IEmployee = req.body;

  salary = parseInt(salary);
  email = email.toLowerCase();

  validations.isEmail(email);
  validations.isStringEmpty(first_name, "first name");
  validations.isStringEmpty(last_name, "last name");
  validations.isStringEmpty(dept, "department");
  validations.isStringEmpty(address, "address");
  validations.isPasswordValid(password);
  validations.isPhoneValid(phone);
  validations.isStringEmpty(position, "position");
  validations.isStringEmpty(supervisor, "supervisor");
  validations.isNumberValid(salary, "salary");
  validations.isDateValid(date_of_birth);
  validations.isDateValid(start_date);
  validations.isStringEmpty(image, "image");

  // Check if employee exists before updating
  const checkSql = "SELECT email FROM employee WHERE emp_id = ? LIMIT 1;";

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

    const { isadmin } = result[0];

    if (isadmin === ADMIN.yes) {
      return res
        .status(403)
        .json({ status: false, message: "Invalid Request" });
    }
  });

  const sql =
    "UPDATE employee SET first_name = ?, last_name = ?, dept = ?, phone = ?, email = ?, password = ?, address = ?, date_of_birth = ?, start_date = ?, position = ?, supervisor = ?, salary = ?, image = ?, isAdmin = ? WHERE emp_id = ?";

  try {
    const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);

    const employee = [
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
      ADMIN.no
    ];

    db.query(sql, [...employee, id], err => {
      if (err) {
        return res.status(400).json({ status: false, message: err });
      }

      return res
        .status(200)
        .json({ status: true, message: "Employee updated successfully" });
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

      return res
        .status(200)
        .json({ status: true, message: "Employee deleted successfully" });
    });
  });
});

router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout successful" });
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
