const mongoose = require('mongoose');
const Joi = require('joi');
// const Profile = require('./profile')
const {Schema} = require("mongoose");
JoiObjectId = require('joi-objectid')(Joi);

const personalDetailsSchema = new mongoose.Schema({
    givenName:{
        type: String,
        required: true,
        maxlength: 255,
    },
    surname:{
        type: String,
        required: true,
        maxlength: 255,
    },
    preferredName:{
        type: String,
        required: true,
        maxlength: 255,
    },
    emailId:{
        type: String,
        required: true,
        maxlength: 255
    },
    mobileNumber:{
        type: Number,
        required: true,
    //     TODO: HAVE TO PUT CUSTOM CONDITION VALIDATION FOR MOBILE NUMBER IN SCHEMA VALIDATION
    },
    location:{
        type: String,
        required: true
    }

});

const personalDetails = mongoose.model('PersonalDetails', personalDetailsSchema);

async function validate(personalDetails){
    const schema = Joi.object({
        givenName: Joi.string().required().min(5).max(255),
        surName: Joi.string().required().min(5).max(255),
        preferred_name: Joi.string().required().min(5).max(255),
        emailId: Joi.string().max(255).required().email(),
        mobileNumber: Joi.number().required(),
        location: Joi.string()
    });

    return schema.validate(personalDetails);
}

module.exports.personalDetailsSchema= personalDetailsSchema;
module.exports.validate = validate;
module.exports.personalDetails = personalDetails;