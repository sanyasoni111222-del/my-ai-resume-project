const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);




/*require all the routes here*/


const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get("/api/test-route", (req, res) => {
  res.send("Test route is working!");
});

// Main Routes
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

// VERY IMPORTANT: Ensure app is exported!
module.exports = app;