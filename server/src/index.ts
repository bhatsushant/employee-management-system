import express, { Express, Request, Response } from "express";
import cors from "cors";
import adminRouter from "../routes/admin";

const app: Express = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());
app.use("/admin", adminRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
