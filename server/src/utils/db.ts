import { config } from "dotenv";
config();
import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "employeedb"
});

db.connect(err => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the database");
  }
});

export default db;
