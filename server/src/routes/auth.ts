import { config } from "dotenv";
config();
import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import db from "../utils/db";
import * as validations from "../utils/validations";

const router = Router();

const sec: string = process.env.ACCESS_TOKEN_SECRET as string;

interface ILoginRequestBody {
  email: string;
  password: string;
}

interface IEmployee {
  first_name: string;
  last_name: string;
  dept: string;
  phone: string;
  email: string;
  password: string;
  address: string;
}

const SALT_ROUNDS = 14;
const ADMIN = {
  yes: 1,
  no: 0
};

// Login route
router.post("/", (req: Request, res: Response) => {
  const { email, password }: ILoginRequestBody = req.body;
  try {
    validations.isEmail(email);
    validations.isStringEmpty(password, "password");

    const sql = "SELECT * FROM employee where email = ?";

    db.query(sql, [email], (err, result) => {
      if (err) {
        validations.throwError(
          validations.ErrorCode.INTERNAL_SERVER_ERROR,
          "Internal Server Error"
        );
      }

      if (!result || result.length < 1) {
        return res
          .status(400)
          .json({ loginStatus: false, message: "Invalid email or password" });
      }

      const {
        email,
        first_name,
        last_name,
        emp_id,
        isadmin,
        password: passwordHash
      } = result[0];

      const doesPasswordMatch = bcrypt.compareSync(password, passwordHash);

      if (!doesPasswordMatch) {
        return res
          .status(400)
          .json({ loginStatus: false, message: "Invalid email or password" });
      }

      const token = jwt.sign({ role: "admin", email: email }, sec, {
        expiresIn: "1d"
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
      });

      return res.status(200).json({
        loginStatus: true,
        message: "Login successful",
        currentUser: {
          email,
          first_name,
          last_name,
          emp_id,
          isadmin: !!isadmin
        }
      });
    });
  } catch (error: any) {
    console.log(error);
    return res
      .status(error.code || validations.ErrorCode.INTERNAL_SERVER_ERROR)
      .json({
        loginStatus: false,
        message: error.message || "Error: Internal server error."
      });
  }
});

router.post("/add_employee", (req: Request, res: Response) => {
  let {
    first_name,
    last_name,
    dept,
    phone,
    email,
    password,
    address
  }: IEmployee = req.body;

  email = email.toLowerCase();

  validations.isEmail(email);
  validations.isStringEmpty(first_name, "first name");
  validations.isStringEmpty(last_name, "last name");
  validations.isStringEmpty(dept, "department");
  validations.isStringEmpty(address, "address");
  validations.isPasswordValid(password);
  validations.isPhoneValid(phone);

  // Check for duplicate email
  const checkSql = "SELECT email FROM employee WHERE email = ? LIMIT 1;";

  db.query(checkSql, [email], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ status: false, message: "Internal server error" });
    }

    if (result.length > 0) {
      return res
        .status(400)
        .json({
          status: false,
          message: "Employee with given email already exists"
        });
    }
  });

  const sql =
    "INSERT INTO employee (emp_id, first_name, last_name, dept, phone, email, password, address, isadmin) VALUES (?)";
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
      ADMIN.no
    ];

    db.query(sql, [employee], (err, result) => {
      if (err) {
        return res.status(400).json({ status: false, message: err });
      }

      return res
        .status(200)
        .json({ status: true, message: "Employee added successfully" });
    });
  } catch (error) {
    console.log(error);
  }
});

// GET route to fetch employee data
router.get("/employees", (req: Request, res: Response) => {
  const sql =
    "SELECT first_name, last_name, dept, phone, email, address FROM employee where isadmin = 0;";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }

    return res.status(200).json(result);
  });
});

// Update employee
router.put("/update_employee/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    dept,
    phone,
    email,
    password,
    address
  }: IEmployee = req.body;

  validations.isEmail(email);
  validations.isStringEmpty(id, "employee id");
  validations.isStringEmpty(first_name, "first name");
  validations.isStringEmpty(last_name, "last name");
  validations.isStringEmpty(dept, "department");
  validations.isStringEmpty(address, "address");
  validations.isPasswordValid(password);
  validations.isPhoneValid(phone);

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
    "UPDATE employee SET first_name = ?, last_name = ?, dept = ?, phone = ?, email = ?, password = ?, address = ? WHERE emp_id = ?";

  try {
    const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);

    db.query(
      sql,
      [first_name, last_name, dept, phone, email, hashedPassword, address, id],
      err => {
        if (err) {
          return res.status(400).json({ status: false, message: err });
        }

        return res
          .status(200)
          .json({ status: true, message: "Employee updated successfully" });
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// Delete employee
router.delete("/delete_employee/:id", (req: Request, res: Response) => {
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

    const sql = "DELETE FROM employee WHERE emp_id = ? LIMIT 1;";
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.status(400).json({ status: false, message: err });
      }

      return res
        .status(200)
        .json({ status: true, message: "Employee deleted successfully" });
    });
  });

  const sql = "DELETE FROM employee WHERE emp_id = ? LIMIT 1;";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(400).json({ status: false, message: err });
    }

    return res
      .status(200)
      .json({ status: true, message: "Employee deleted successfully" });
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
