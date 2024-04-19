import { config } from "dotenv";
config();
import mysql from "mysql";

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the database");
  }
});

export default db;
