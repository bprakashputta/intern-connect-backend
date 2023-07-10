const mongoose = require('mongoose');
const mongooseEncryption = require('mongoose-encryption');
const Joi = require('joi');
// const Profile = require('./profile')
const {Schema} = require("mongoose");
JoiObjectId = require('joi-objectid')(Joi);
const passport = require('passport');
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20');
const bcrypt = require('bcrypt');

// Setup Sendgrid
const MagicLinkStrategy = require('passport-magic-link').Strategy;
const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SENDGRID_EMAIL_API_KEY);



const userSchema = new mongoose.Schema({
    username:{
        type: String,
        maxlength: 255,
        min:6,
        unique: true
    },
    socialProfileId: {
        type: String
    },
    firstName:{
        type: String,
        maxlength:255,
        required: true
    },
    lastName:{
        type: String,
        maxlength:255,
        required: true
    },
    email: {
        type: String,
        maxlength: 255,
        required: false
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255
    },
    userType:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    email_verified:{
        type: Number,
        enum: [0,1],
        default: 0,
        required: true
    },
    // profile: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Profile',
    //     unique: true
    // },
    profilePhoto:{
        type: String
    },
    source:{
        type: String,
        max: 255
    }
},
{
    timestamps: true
});

const secretKey = process.env.DB_ENCRYPTION_SECRET_KEY_STRING
userSchema.plugin(mongooseEncryption, {secret: secretKey, encryptedFields: ['password']});
userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);
// CREATE USER MODEL FROM SCHEMA
const User = mongoose.model('User', userSchema);

// PASSPORT Strategy for User Login
passport.use('local-login', new LocalStrategy({
    passReqToCallback: true
  },async function(request, user_email, user_password, done) {
    console.log('Received User login request');
    // STEP 1: Find is user with email exists
    console.log(user_email);
    // Find if user exists in the registered users.
    User.findOne({ email: user_email}).exec()
    .then(async user => {
        console.log("User found with email : ", user.email);
        console.log("Comparing passwords");
        console.log("User Password : ", user.password);
        console.log("Form entered password : ", user_password);

        console.log("!user || !bcrypt.compareSync(user_password, user.password) : ", (!user || !bcrypt.compareSync(user_password, user.password)));
        console.log("!user : ", (!user));
        console.log("!bcrypt.compareSync(user_password, user.password)",(!user || !bcrypt.compareSync(user_password, user.password)));

        if (!user || await bcrypt.compare(user_password, user.password)) {
            // STEP 2: User does not exist, create new user.
            return done(null, false, {
                message: "Invalid email or password"
            });
        } else {
            console.log("Passwords match");
            console.log(`User : ${user}`);
            // STEP 3: User with email already exists
            if (user.source != "Email") {
                return done(null, false, {
                    message: "You have previously signed up with a different sign in method"
                });
            }

            request.user = user;
            console.log("Returning user");
            // STEP 4: Successfully logged in
            return done(null, user, {message: "Successfully logged in."});
        }
    })
    .catch(err => done(err))
  }
));

// MagicLink Strategy for User registration using email and send activation link.
passport.use(
    new MagicLinkStrategy({
    secret: process.env.MAGIC_LINK_ENCRYPTION_SECRET,
    userFields: [ 'email', 'password', 'firstName', 'lastName'],
    tokenField: 'token',
    verifyUserAfterToken: true
  }, function send(user, token) {
    // Logging user object
    console.log("Sign Up request : ",user);
    // console.log("Token : ", token);
    // STEP 1: Generate activation link and send email.
    const link = 'http://localhost:8080/user/register/email/verify?token=' + token;
    const msg = {
      to: user.email,
      from: process.env.SENDGRID_EMAIL_ID,
      subject: 'Verify your account on Get Your Internship Portal',
      text: 'Hello! Click the link below to finish signing in to Intern Connect.\r\n\r\n' + link,
      html: `<h3>Hello!</h3><p>Click the link below to finish signing in to Intern Connect.</p><p><a href="${link}">Sign in</a></p>`,
    };
    // STEP 2: SEND USER SignUp Email using SENDGRID
    return sendgrid.send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
  }, function verify(user, token) {
        // USER VERIFICATION FUNCTION
        // Log user verification request data
        // console.log('Verify User Request : ', user)
        return new Promise(function(resolve, reject) {
            // STEP 1: Check if the user exists or not.
            newUser = User.findOne({email: user.email}).exec()
            .then(newUser => {
                console.log("User: ", user)
                console.log("New User: ", newUser)
                if (!newUser) {
                    // User does not exist, create new user.
                    // STEP 2: Create a new user using Mongoose User Object
                    newUser = new User({
                        socialProfileId: "None",
                        username:  Date.now(),
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        password: user.password,
                        profilePhoto: "",
                        email_verified: 1,
                        source: 'Email',
                    });
                    // STEP 3: Save the user signup object.
                    newUser.save()
                        .then(user =>{
                            resolve(user)
                        })
                        .catch(err =>{
                            console.log(err.message);
                            reject(err)
                        })
                } else {
                    // USER Already Exists in the database
                    // TODO:: This function is redundant for users who are already present, they should not get the user activation link in the first place
                    console.log("Already existing user : ",user);
                    console.log(`User with email:${user.email} already activated.`);
                    if (user.source != "Email") {
                        return done(null, false, {
                            message: "You have previously signed up with a different sign in method"
                        });
                    }

                    return resolve(user);
                }
            }).catch(err => {
                reject(err);
            })
        });
    })
);

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
        state: true,
        scope: ['profile', 'email']
    }, 
    async (accessToken, refreshToken, profile, done) => {
    // console.log(profile);
    // Find if user with this google already exists
        User.findOne({ email: profile.emails[0].value}).exec()
        .then(async user => {
            if (!user) {
                // User does not exist, create new user.
                user = new User({
                    socialProfileId: profile.id,
                    username: profile.name.givenName + Date.now(),
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    email: profile.emails[0].value,
                    password: Math.random().toString(36).slice(2, 10),
                    profilePhoto: profile.photos[0].value,
                    email_verified: 1,
                    source: 'Google',
                });

                console.log("New User created");
                user.save()
                    .then(user =>{
                        done(null, user)
                    })
                    .catch(err =>{
                        console.log(err.message);
                        done(err)
                    })
            } else {
                console.log(`User with email:${user.email} already exists.`);
                console.log("Already existing user : ",user);
                // User with email already exists
                if (user.source != "Google") {
                    return done(null, false, {
                        message: "You have previously signed up with a different sign in method"
                    });
                }
                // User Already exists
                return done(null, user);
            }
        })
        .catch(err => done(err))
    }
));

// Searialize and De-Serialize user
passport.serializeUser((user, cb)=>{
    process.nextTick(()=>{
      cb(null, { id: user.id, username: user.username, name: user.firstName + ' ' + user.lastName });
    });
});

passport.deserializeUser((user, cb)=>{
    process.nextTick(()=>{
        return cb(null, user);
    });
});

async function validate(user){
    const schema = Joi.object({
        username: Joi.string().max(255).min(6),
        socialProfileId: Joi.string(),
        firstName: Joi.string().max(255).required(),
        lastName: Joi.string().max(255).required(),
        email: Joi.string().max(255).email(),
        password: Joi.string().required().min(8).max(255),
        userType: Joi.string().valid('user', 'admin'),
        profilePhoto: Joi.string(),
        source: Joi.string().max(255)
    });
    return schema.validate(user);
}

module.exports.userSchema= userSchema;
module.exports.validate = validate;
module.exports.User = User;