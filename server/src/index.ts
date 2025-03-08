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

const PORT = process.env.PORT || 3000;

function controller(req: express.Request, res: express.Response) {
  req.session.user;
}

const app: Express = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(
  session({
    name: "auth-cookie",
    secret: process.env.SESSION_SECRET || "yourSecretHere",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200
  })
);

app.use(express.json());
app.use("/auth", authRouter);
app.use("/employees", employeeRouter);

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
