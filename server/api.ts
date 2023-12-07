import express from "express";
import cors from "cors";
import path from "path";
import router from "./routes/productRoutes";
import userRouter from "./routes/userRoutes";

const app = express();
const PORT = 8000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use("/api/products", router);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
