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

async function validate(profile){

    // TODO: HAVE TO WRITE VALIDATION SCHEMA FOR PROFILE

    // const schema = Joi.object({
    //     name: Joi.string().required().min(5).max(255),
    //     emailId: Joi.string().max(255).required().email(),
    //     // password: Joi.string().required().min(8).max(255),
    //     isAdmin: Joi.boolean(),
    //     resumelink: Joi.string().max(500)
    // });
    //
    // return schema.validate(profile);
}

module.exports.profileSchema= profileSchema;
module.exports.validate = validate;
module.exports.Profile = Profile;