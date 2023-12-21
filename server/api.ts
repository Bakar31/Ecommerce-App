import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import path from "path";
import passport from 'passport';
import jwt from "jsonwebtoken";
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
import router from "./routes/productRoutes";
import userRouter from "./routes/userRoutes";
const passportSetup = require('./config/passport.setup');

interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;
}

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Add session and cookie-parser middleware
app.use(cookieParser());
app.use(session({
  secret: 'abc',
  resave: false,
  saveUninitialized: false,
}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/api/products", router);
app.use("/api/user", userRouter);

app.use(passport.initialize());
app.use(passport.session());

//Sign up
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'],  prompt: 'select_account' }));
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login-failure' }),
  (req: Request, res: Response) => {
    const user: User = req.user as User;

    if (!req.user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = jwt.sign({ userId: user.id }, "bakar31", {
      expiresIn: "1h",
    });

    res.cookie("userToken", token, {
      httpOnly: true,
    });
    res.redirect('http://localhost:3000/');
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
