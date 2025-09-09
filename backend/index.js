
import express from "express";
import cookieParser from "cookie-parser";
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

dotenv.config({});
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const corsOptions = {
  origin: [
    "http://localhost:5173",       
    "http://localhost:8000", 
    "https://jobkitty.in",  
    "http://jobkitty.in", 
    "http://168.231.123.129:8000",
    "https://168.231.123.129:8000"
          
  ],
  credentials: true,
};



app.use(cors(corsOptions));


app.get('/api', (req, res) => {
    res.status(200).json({ message: 'Server is running', success: true });
});

const PORT = process.env.PORT || 8000;

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/category",categoryRoute);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/admin",adminRoute)

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const frontendDistPath = path.join(__dirname, "../frontend/dist");
// app.use(express.static(frontendDistPath));


// app.get("*", (req, res) => {
//     if (req.originalUrl.startsWith("/api/")) {
//         res.status(404).json({ message: "API route not found" });
//     } else {
//         res.sendFile(path.join(frontendDistPath, "index.html"));
//     }
// });

app.listen(PORT,()=>{
    connectDB();
    console.log(`http://localhost:${PORT}/api/v1/`);
}).on('error', (err) => {
    console.error('Server error:', err);
});