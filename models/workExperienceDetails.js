const mongoose = require('mongoose');
const Joi = require('joi');
// const Profile = require('./profile')
const {Schema} = require("mongoose");
JoiObjectId = require('joi-objectid')(Joi);

const workExperienceDetailsSchema = new mongoose.Schema({
    experience: {
        type: [new mongoose.Schema({
            companyName:{
                type: String,
                required: true,
                maxlength: 255,
            },
            roles: {
                type: [new mongoose.Schema({
                    roleName:{
                        type: String,
                        required: true,
                        maxlength: 255,
                    },
                    roleType:{
                        type: String,
                        enum: ['Full-Time', 'Internship', 'Part-Time'],
                        required: true,
                    },
                    startDate:{
                        type: Number,
                        required: true
                    },
                    endDate:{
                        type: Number,
                        required: true
                    },
                    description:{
                        type: String,
                        required: true,
                        max: 2000
                    }
                })],
                required: true,
                min: 1
            }
        })],
        required: false
    }
});

const workExperienceDetails = mongoose.model('workExperienceDetails', workExperienceDetailsSchema);

async function validate(workExperienceDetails){
    const schema = Joi.object({
        experience: Joi.array().items(
            Joi.object({
                companyName: Joi.string().required().max(255),
                roles: Joi.array().items({
                    roleName: Joi.string().required().max(255),
                    roleType: Joi.string().required().valid('Full-Time', 'Internship', 'Part-Time'),
                    // TODO: ONE MORE VALIDATION FOR START DATE TO BE
                    //  LESS THAN END DATA NEEDS TO BE ADDED
                    startDate: Joi.number().required(),
                    endDate: Joi.number().required(),
                    description: Joi.string().required().max(2000)
                }).required().min(1)
            })
        )

    });

    return schema.validate(workExperienceDetails);
}

module.exports.workExperienceDetailsSchema= workExperienceDetailsSchema;
module.exports.validate = validate;
module.exports.workExperienceDetails = workExperienceDetails;