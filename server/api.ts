import express from "express";
import cors from "cors";
import router from "./routes/productRoutes";
import multer, { FileFilterCallback } from 'multer';

const app = express();
const PORT = 8000;

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: (arg0: null, arg1: string) => void) => {
    cb(null, "uploads/");
    console.log(file);
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Rename the file if needed
  }
});

const upload = multer({ storage: storage});

app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use('/api/products', router);

app.post("/upload", upload.single('image'), (_req, res) => {
  res.send('Image Uploaded..')})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
