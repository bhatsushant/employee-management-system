import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import db from "../utils/db";

const adminRouter = express.Router();

const sec: string = process.env.ACCESS_TOKEN_SECRET as string;

adminRouter.post("/", (req: Request, res: Response) => {
  const { email, password, isadmin } = req.body;
  const sql =
    "SELECT * FROM users where email = ? and password = ? and isadmin = ?";
  try {
    db.query(sql, [email, password, isadmin], (err, result) => {
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
            .json({ loginStatus: false, message: "Login successful" });
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

adminRouter.route("/add_dept").post((req: Request, res: Response) => {
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

adminRouter.route("/add_emp").post((req: Request, res: Response) => {
  const {
    first_name,
    last_name,
    dept,
    phone,
    email,
    address,
    joining_date,
    image,
    isadmin
  } = req.body;
  const sql =
    "INSERT INTO employee (emp_id, first_name, last_name, dept, phone, email, address, joining_date, image, isadmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  try {
    db.query(
      sql,
      [
        uuidv4(),
        first_name,
        last_name,
        dept,
        phone,
        email,
        address,
        joining_date,
        image,
        isadmin
      ],
      (err, result) => {
        if (err) {
          return res.status(400).json({ status: false, message: err });
        } else {
          return res
            .status(200)
            .json({ status: true, message: "Employee added successfully" });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

export default adminRouter;
