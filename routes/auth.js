const mongoose = require('mongoose');
const bcryt = require('bcrypt');
const express = require('express');
const Joi = require("joi");
const {User, validate} =require('../models/user');
const router = express.Router();
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;


router.get('/google',    
    passport.authenticate('google', {scope: ["profile", "email"]})
);
 
router.get('/google/register', 
    passport.authenticate('google', 
    {
        scope: ["profile", "email"],
        failureRedirect: '/user/register/home'
    }),
    (request, response)=>{
        response.redirect("/");
    }
);

module.exports = router;
