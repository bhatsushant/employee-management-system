import { config } from "dotenv";
config();
import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../utils/db";
import * as validations from "../utils/validations";

const router = Router();

const sec: string = process.env.ACCESS_TOKEN_SECRET as string;

interface ILoginRequestBody {
  email: string;
  password: string;
}

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

export default router;
