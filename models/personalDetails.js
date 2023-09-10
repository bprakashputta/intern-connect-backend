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

const PersonalDetails = mongoose.model('PersonalDetails', personalDetailsSchema);

async function validate(personalDetails){
    const schema = Joi.object({
        givenName: Joi.string().max(255).required(),
        surname: Joi.string().max(255).required(),
        preferredName: Joi.string().max(255).required(),
        emailId: Joi.string().email().max(255).required(),
        mobileNumber: Joi.number().integer().required(),
        location: Joi.string().required()
    }).options({ abortEarly: false });

    return schema.validate(personalDetails);
}

module.exports.personalDetailsSchema= personalDetailsSchema;
module.exports.validatePersonalDetails = validate;
module.exports.PersonalDetails = PersonalDetails;