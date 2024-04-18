import express, { Express } from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import employeeRouter from "./routes/employees";
import session from "express-session";
import User from "./utils/User";

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

function controller(req: express.Request, res: express.Response) {
  req.session.user;
}

const app: Express = express();

app.use(
  session({
    name: "auth-cookie",
    secret: process.env.SESSION_SECRET || "yourSecretHere",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: "auto",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200
  })
);

// app.use(
//   session({
//     name: "auth-cookie",
//     secret: "your-secret-key",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false } // set to true if your using https
//   })
// );

app.use(express.json());
app.use("/auth", authRouter);
app.use("/employees", employeeRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
