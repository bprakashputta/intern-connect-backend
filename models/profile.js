const mongoose = require('mongoose');
const Joi = require('joi');
const {Schema} = require("mongoose");
JoiObjectId = require('joi-objectid')(Joi);

const profileSchema = new mongoose.Schema({
    personal_details:{
        type: Schema.Types.ObjectId,
        ref: 'PersonalDetails'
    },
    educational_details:{
        type: Schema.Types.ObjectId,
        ref: 'EducationalDetails'
    },
    work_experience_details:{
        type: Schema.Types.ObjectId,
        ref: 'WorkExperienceDetails'
    },
    social_media_links:{
        type: Schema.Types.ObjectId,
        ref: 'PersonalDetails'
    },
    skillset:{
        type: [Schema.Types.ObjectId],
        ref: 'Skill'
    }

});

const Profile = mongoose.model('Profile', profileSchema);

function validateProfile(profile) {
    const schema = Joi.object({
        // personal_details: Joi.object({
        //     givenName: Joi.string().required().max(255),
        //     surname: Joi.string().required().max(255),
        //     preferredName: Joi.string().required().max(255),
        //     emailId: Joi.string().required().max(255),
        //     mobileNumber: Joi.number().required(),
        //     location: Joi.string().required(),
        // }).required(),

        // educational_details: Joi.object({
        //     collegeName: Joi.string().required().max(255),
        //     branchOfStudy: Joi.string().required().max(255),
        //     educationLevel: Joi.string().required().max(255),
        //     startDate: Joi.number().required(),
        //     endDate: Joi.number().required(),
        // }).required(),

        // work_experience_details: Joi.object({
        //     experience: Joi.array().items(
        //         Joi.object({
        //             companyName: Joi.string().required().max(255),
        //             roles: Joi.array().items(
        //                 Joi.object({
        //                     roleName: Joi.string().required().max(255),
        //                     roleType: Joi.string().required().valid('Full-Time', 'Internship', 'Part-Time'),
        //                     startDate: Joi.number().required(),
        //                     endDate: Joi.number().required(),
        //                     description: Joi.string().required().max(2000),
        //                 })
        //             ).min(1).required(),
        //         })
        //     ),
        // }),

        // social_media_links: Joi.object({
        //     githubURL: Joi.string().uri().allow(''),
        //     linkedinURL: Joi.string().uri().allow(''),
        //     portfolioURL: Joi.string().uri().allow(''),
        // }),

        // skillset: Joi.object({
        //     skills: Joi.array().items(
        //         Joi.object({
        //             skillName: Joi.string().required().max(255),
        //             proficiency: Joi.string().required().valid('Beginner', 'Intermediate', 'Advanced', 'Expert'),
        //         })
        //     ).min(1).required(),
        // }).options({ abortEarly: false }),
    });

    return schema.validate(profile);
}

module.exports.profileSchema= profileSchema;
module.exports.validateProfile = validateProfile;
module.exports.Profile = Profile;