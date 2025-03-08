import { config } from "dotenv";
config();
import mysql from "mysql2/promise";

const createDatabase = async () => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || ""
    });

    const [result] = await connection.query(
      "CREATE DATABASE IF NOT EXISTS employeedb"
    );
    console.log("Database created");
  } catch (error) {
    console.error("Error creating the database:", error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

createDatabase();
