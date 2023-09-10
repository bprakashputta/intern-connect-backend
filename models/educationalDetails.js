const mongoose = require('mongoose');
const Joi = require('joi');
// const Profile = require('./profile')
const {Schema} = require("mongoose");
JoiObjectId = require('joi-objectid')(Joi);

const educationalDetailsSchema = new mongoose.Schema({
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
    educationalLevel:{
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

const EducationalDetails = mongoose.model('EducationalDetails', educationalDetailsSchema);

async function validate(educationalDetails){
    const schema = Joi.object({
        collegeName: Joi.string().max(255).required(),
        branchOfStudy: Joi.string().max(255).required(),
        educationalLevel: Joi.string().max(255).required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
    }).options({ abortEarly: false });

    return schema.validate(educationalDetails);
}

module.exports.educationalDetailsSchema= educationalDetailsSchema;
module.exports.validateEducationalDetails = validate;
module.exports.EducationalDetails = EducationalDetails;