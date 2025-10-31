import express from "express";
import cookieParser from "cookie-parser";
import helmet from 'helmet'
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import categoryRoute from "./routes/category.route.js";
import contactRoute from "./routes/contact.route.js";
import adminRoute from "./routes/admin.route.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8000",
  "https://jobkitty.in",
  "https://www.jobkitty.in",
  "http://jobkitty.in",
  "http://www.jobkitty.in",
  "https://api.jobkitty.in",
  "http://168.231.123.129:8000",
  "https://168.231.123.129:8000",
];

const corsOptions = {
  origin: function (origin, callback) {
   
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS: " + origin), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Disposition"],
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

const PORT = process.env.PORT || 8000;
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/category",categoryRoute);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/admin",adminRoute)


app.listen(PORT,()=>{
    connectDB();
    console.log(`http://localhost:${PORT}/api/v1/`);
}).on('error', (err) => {
    console.error('Server error:', err);
});