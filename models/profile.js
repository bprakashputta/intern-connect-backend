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


module.exports.profileSchema= profileSchema;
module.exports.Profile = Profile;