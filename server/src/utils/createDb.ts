import mysql from "mysql";

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password"
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
