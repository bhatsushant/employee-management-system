import { config } from "dotenv";
config();
import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import db from "../utils/db";

const router = Router();

const sec: string = process.env.ACCESS_TOKEN_SECRET as string;

// Login route
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

router.post("/add_employee", (req: Request, res: Response) => {
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
    address,
    image,
    isadmin
  } = req.body;
  const sql =
    "UPDATE employee SET first_name = ?, last_name = ?, dept = ?, phone = ?, email = ?, password = ?, address = ?, image = ?, isadmin = ? WHERE emp_id = ?";
  try {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err)
        return res.status(500).json({ Status: false, message: "Query Error" });
      db.query(
        sql,
        [
          first_name,
          last_name,
          dept,
          phone,
          email,
          hash,
          address,
          image,
          isadmin,
          id
        ],
        (err, result) => {
          if (err) {
            return res.status(400).json({ status: false, message: err });
          } else {
            return res
              .status(200)
              .json({ status: true, message: "Employee updated successfully" });
          }
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
});

// Delete employee
router.delete("/delete_employee/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  const sql = "DELETE FROM employee WHERE emp_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(400).json({ status: false, message: err });
    } else {
      return res
        .status(200)
        .json({ status: true, message: "Employee deleted successfully" });
    }
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
