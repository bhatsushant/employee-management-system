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
const store = new session.MemoryStore();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourSecretHere",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: "auto",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    },
    store: store
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

app.use(express.json());
app.use("/auth", authRouter);
app.use("/employees", employeeRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
