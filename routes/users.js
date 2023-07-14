const mongoose = require("mongoose");
const bcryt = require("bcrypt");
const express = require("express");
const Joi = require("joi");
const { User, validate } = require("../models/user");
const router = express.Router();
const passport = require("passport");
const passportLocal = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;


router.get("/login", (request, response) => {
  if (request.isAuthenticated()) {
    return response.redirect(process.env.REACT_APP_SERVER_URL + "/");
  }
  return response.redirect("user/login");
});

router.post(
  "/login",
  passport.authenticate("local-login"),
  (request, response, next) => {
    // STEP 1: Check if user is already authenticated
    console.log("Login request processed");
    if (request.isAuthenticated()) {
      console.log("You are authorised");
      return response.redirect("/");
    }
    return response.redirect("/user/login");
  }
);

// Define the login verification route
router.get("/login/verify", (request, response) => {
  console.log("Verifying login status");
  console.log("Status : ", request.isAuthenticated());
  console.log(request.user);
  console.log("request",request);
  if (request.isAuthenticated()) {
    // STEP 1: If User is authenticated, return the logged-in user object
    return response.json({ user: request.user });
  } else {
    // User is not authenticated, so return error
    return response.status(401).json({ message: "User is not logged in" });
  }
});

router.get("/register", async (request, response) => {
  if (request.isAuthenticated()) {
    return response.redirect(
      process.env.REACT_APP_SERVER_URL + "/user/profile"
    );
  } else {
    response.redirect(process.env.REACT_APP_SERVER_URL + "/user/register");
  }
});

router.get("/profile", (request, response) => {
  console.log("hello profile");
  console.log("Authenticated user : ", request.user.email);
  if (request.isAuthenticated()) {
    return response.redirect(
      process.env.REACT_APP_SERVER_URL + "/user/Profile"
    );
  } else {
    return response.redirect(process.env.REACT_APP_SERVER_URL + "/user/login");
  }
});

router.post(
  "/register/email",
  passport.authenticate("magiclink", {
    action: "requestToken",
    failureRedirect: process.env.REACT_APP_SERVER_URL + "/user/register",
  }),
  (request, response, next) => {
    console.log("Signup request received.");
    response.redirect("/user/register/email/check");
    // response.send('Please verify your email address to activate account');
  }
);

router.get("/register/email/check", function (request, response, next) {
  // response.render('user/login/email/check');
  response.send("Please verify your email address to activate account");
});

// Verify Registered Email
router.get(
  "/register/email/verify",
  passport.authenticate("magiclink", {
    successReturnToOrRedirect: "/",
    failureRedirect: process.env.REACT_APP_SERVER_URL + "/user/register",
  })
);

router.get("/details", async (request, response) => {
  if (request.isAuthenticated()) {
    try {
    const user_id = request.user.id;

    const user = await User.findById(user_id );
      console.log(user)
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    response.json({ user });
  } catch (error) {
    response.status(500).json({ message: "Failed to retrieve user details", error });
  }}
});



router.post("/logout", (request, response) => {
  request.logout((err) => {
    if (err) {
      return next(err);
    }
    response.redirect(process.env.REACT_APP_SERVER_URL);
  });
});

module.exports = router;
