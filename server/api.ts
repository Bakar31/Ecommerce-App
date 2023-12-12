import express from "express";
import cors from "cors";
import path from "path";
import passport from 'passport';
const session = require('express-session');
const cookieParser = require('cookie-parser');
import router from "./routes/productRoutes";
import userRouter from "./routes/userRoutes";
const passportSetup = require('./config/passport.setup');

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
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login-failure' }),
  (req, res) => {
    res.redirect('http://localhost:3000/');
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
