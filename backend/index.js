
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
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
    origin:'http://localhost:5173',
    credentials:true
}

app.use(cors(corsOptions));

// Health check endpoint
app.get('/health', (req, res) => {
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



app.listen(PORT,()=>{
    connectDB();
    console.log(`Server running at port ${PORT}`);
}).on('error', (err) => {
    console.error('Server error:', err);
});

