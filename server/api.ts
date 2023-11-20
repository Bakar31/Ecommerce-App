import express from "express";
import cors from "cors";
import router from "./routes/productRoutes";

const app = express();
const PORT = 8000;

app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from this origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use('/api/products', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
