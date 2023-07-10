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
        collegeName: Joi.string().required().max(255),
        branchOfStudy: Joi.string().required().max(255),
        educationLevel: Joi.string().required().max(255),

        // TODO: ONE MORE VALIDATION FOR START DATE TO BE
        //  LESS THAN END DATA NEEDS TO BE ADDED
        startDate: Joi.number().required(),
        endDate: Joi.number().required(),

    });

    return schema.validate(educationDetails);
}

module.exports.educationDetailsSchema= educationDetailsSchema;
module.exports.validate = validate;
module.exports.educationDetails = educationDetails;