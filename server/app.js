import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { fileURLToPath } from "url";

import userRoute from "./routes/userRoute.js";
import eventRoute from "./routes/eventRoute.js";
import reservationRoute from "./routes/reservationRoute.js";
import { verifyToken } from "./controllers/authController.js";

import {
  createEvent,
  updateEvent,
} from "./controllers/eventController.js";
// CONFIGURATIONS

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(
  bodyParser.urlencoded({ limit: "30mb", extended: true })
);
app.use(cors());
app.use(
  "/assets",
  express.static(path.join(__dirname, "public/assets"))
);
// FILE STORAGE

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
app.post(
  "/event/admin",
  // upload.single("picture"),
  createEvent
);
app.patch(
  "/event/admin/:eventId",
  upload.single("picture"),
  updateEvent
);

app.use("/user", userRoute);
app.use("/event", eventRoute);
app.use("/reservation", reservationRoute);

const PORT = process.env.PORT || 6001;
const DB = process.env.MONGO_URL.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server is running on port ${PORT}`)
    );
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => {
    console.log(`${error} did not connect`);
  });
