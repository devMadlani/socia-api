const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/messages");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
dotenv.config();

const verifyToken =require("./middelware/authMiddleware")

const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend URL
  credentials: true, // Allow credentials (cookies) to be sent
};

// Use the CORS middleware with the specified options

const connectedToMongo = async () => {
  url = process.env.VITE_MONGO_URL;
  try {
    await mongoose.connect(url);
    console.log("DB connected");
  } catch (error) {
    console.error("Failed to connect to MongoDB", err);
  }
};
connectedToMongo();
app.use("/images", express.static(path.join(__dirname, "public/images")));
//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors(corsOptions));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    const filePath = `/images/${req.file.filename}`; // Return the file path
    res.status(200).json({ fileName: req.file.filename, filePath });
    // return res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/auth/checkAuth",verifyToken,(req,res)=>{
  res.status(200).json({user:req.user})
})
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversation", conversationRoute);
app.use("/api/message", messageRoute);

app.listen(8800, () => {
  console.log("app is running at 8800 port ");
});
