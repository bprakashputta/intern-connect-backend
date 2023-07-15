require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("express-flash");
const bcrypt = require("bcrypt");
const saltRounds = process.env.SALTROUNDS;
const path = require("path");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

//AWS
const fileUploadRouter = require("./routes/fileUpload"); // Import the file upload router

// PATH TO STORE ENVIRONMENT VARIABLES
const dir = process.cwd();
const url = new URL(`file://${dir}/.env`);
require("dotenv").config({ path: url });

// PORT NUMBER for the server
const PORT = process.env.PORT;

// Initialise App
const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.REACT_APP_SERVER_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    allowedHeaders: "access-control-allow-origin,Content-Type,User-id",
  })
);
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self' 'unsafe-eval';");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize sessions
app.use(
  session({
    secret: process.env.SESSION_ENCRYPTION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
      ttl: 14 * 24 * 60 * 60,
      autoRemove: "native",
    }),
  })
);

// Initialize passport session
app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Connect to MongoDB Database
const dbConnect = require("./middlewares/dbConnect");
dbConnect();

// Import all the routes
const user = require("./routes/users");
const auth = require("./routes/auth");
const company = require("./routes/company");
const job = require("./routes/job");
const task = require("./routes/task");
const taskAllotment = require("./routes/taskAllotment");
const jobApplication = require("./routes/jobApplication");

app.use("/user", user);
app.use("/auth", auth);
app.use("/company", company);
app.use("/jobs", job);
app.use("/task", task);
app.use("/taskallotment", taskAllotment);
app.use("/jobapplication", jobApplication);
app.use("/file", fileUploadRouter);

// GET ROUTE for HOME PAGE
app.get("/", (request, response) => {
  // response.send('Hello Bhanu, welcome to the website');
  response.redirect(process.env.REACT_APP_SERVER_URL + "/");
});

app.get("/home", (request, response) => {
  response.redirect(process.env.REACT_APP_SERVER_URL + "/");
});

app.get("/index", (request, response) => {
  response.redirect(process.env.REACT_APP_SERVER_URL + "/");
});

app.get("*", (request, response) => {
  response.redirect(process.env.REACT_APP_SERVER_URL + "/");
});

app.listen(PORT, (err) => {
  if (err) {
    console.log("SERVER RAN INTO AN ERROR : ", err);
    return err;
  }
  console.log(`SERVER IS RUNNING ON PORT : ${PORT}`);
});
