import express, { Express } from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import employeeRouter from "./routes/employees";

const app: Express = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());
app.use("/auth", authRouter);
app.use("/employees", employeeRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
