import { config } from "dotenv";
config();
import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../utils/db";

const router = Router();

const sec: string = process.env.ACCESS_TOKEN_SECRET as string;

router.post("/", (req: Request, res: Response) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users where email = ? and password = ?";
  try {
    db.query(sql, [email, password], (err, result) => {
      if (err) {
        return res.status(400).json({ loginStatus: false, message: err });
      } else {
        if (result.length > 0) {
          const email = result[0].email;
          const token = jwt.sign({ role: "admin", email: email }, sec, {
            expiresIn: "1d"
          });
          res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
          });

          return res
            .status(200)
            .json({ loginStatus: true, message: "Login successful" });
        } else {
          res
            .status(400)
            .json({ loginStatus: false, message: "Invalid email or password" });
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.route("/add_dept").post((req: Request, res: Response) => {
  const { name } = req.body;
  const sql = "INSERT INTO department (dept_id, dept_name) VALUES (?, ?)";
  try {
    db.query(sql, [uuidv4(), name], (err, result) => {
      if (err) {
        return res.status(400).json({ status: false, message: err });
      } else {
        return res
          .status(200)
          .json({ status: true, message: "Category added successfully" });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.route("/add_emp").post((req: Request, res: Response) => {
  const {
    first_name,
    last_name,
    dept,
    phone,
    email,
    password,
    address,
    image,
    isadmin
  } = req.body;
  const sql =
    "INSERT INTO employee (emp_id, first_name, last_name, dept, phone, email, password, address, image, isadmin) VALUES (?)";
  try {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err)
        return res.status(500).json({ Status: false, message: "Query Error" });
      const values = [
        uuidv4(),
        first_name,
        last_name,
        dept,
        phone,
        email,
        hash,
        address,
        image,
        isadmin
      ];
      db.query(sql, [values], (err, result) => {
        if (err) {
          return res.status(400).json({ status: false, message: err });
        } else {
          return res
            .status(200)
            .json({ status: true, message: "Employee added successfully" });
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
});

// GET route to fetch employee data
router.get("/employees", (req: Request, res: Response) => {
  const sql = "SELECT * FROM employee";
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result);
  });
});

export default router;
