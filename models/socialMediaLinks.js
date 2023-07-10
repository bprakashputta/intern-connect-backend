const mongoose = require('mongoose');
const Joi = require('joi');
// const Profile = require('./profile')
const {Schema} = require("mongoose");
JoiObjectId = require('joi-objectid')(Joi);

const socialMediaLinksSchema = new mongoose.Schema({
    githubURL: {
        type: String
    },
    linkedinURL: {
        type: String
    },
    portfolioURL:{
        type: String
    }
});

const socialMediaLinks = mongoose.model('SocialMediaLinks', socialMediaLinksSchema);

async function validate(socialMediaLinks){
    const schema = Joi.object({
        githubURL: Joi.string().uri().label('GitHub URL').allow(''),
        linkedinURL: Joi.string().uri().label('Linkedin URL').allow(''),
        portfolioURL: Joi.string().uri().label('Portfolio URL').allow('')
    });

    return schema.validate(socialMediaLinks);
}

module.exports.socialMediaLinksSchema= socialMediaLinksSchema;
module.exports.validate = validate;
module.exports.socialMediaLinks = socialMediaLinks;