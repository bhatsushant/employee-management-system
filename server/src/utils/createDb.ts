import { config } from "dotenv";
config();
import mysql from "mysql";

const con = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

con.connect(function (err) {
  try {
    con.query(
      "CREATE DATABASE IF NOT EXISTS employeedb",
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log("Database created");
        }
      }
    );
  } catch (error) {
    console.error("Error creating to database:", error);
  } finally {
    con.end();
  }
});
