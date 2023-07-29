const mongoose = require('mongoose');
const Joi = require('joi');
// const Profile = require('./profile')
const {Schema} = require("mongoose");
JoiObjectId = require('joi-objectid')(Joi);

const educationDetailsSchema = new mongoose.Schema({
    collegeName:{
        type: String,
        required: true,
        maxlength: 255,
    },
    branchOfStudy:{
        type: String,
        required: true,
        maxlength: 255,
    },
    educationLevel:{
        type: String,
        required: true,
        maxlength: 255,
    },
    startDate:{
        type: Number,
        required: true
    },
    endDate:{
        type: Number,
        required: true
    }
});

const educationDetails = mongoose.model('educationDetails', educationDetailsSchema);

async function validate(educationDetails){
    const schema = Joi.object({
        collegeName: Joi.string().max(255).required(),
        branchOfStudy: Joi.string().max(255).required(),
        educationLevel: Joi.string().max(255).required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
    }).options({ abortEarly: false });

    return schema.validate(educationDetails);
}

module.exports.educationDetailsSchema= educationDetailsSchema;
module.exports.validate = validate;
module.exports.educationDetails = educationDetails;