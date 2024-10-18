const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const cors = require("cors");
dotenv.config();

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

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.listen(8800, () => {
  console.log("app is running at 8800 port ");
});
