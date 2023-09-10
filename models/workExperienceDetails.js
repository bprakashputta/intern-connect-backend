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

const WorkExperienceDetails = mongoose.model('WorkExperienceDetails', workExperienceDetailsSchema);

async function validate(workExperienceDetails){
    const roleSchema = Joi.object({
        roleName: Joi.string().required().max(255),
        roleType: Joi.string().required().valid('Full-Time', 'Internship', 'Part-Time'),
        startDate: Joi.number().required(),
        endDate: Joi.number().required(),
        description: Joi.string().required().max(2000)
      }).required().options({ abortEarly: false });
    
      const schema = Joi.object({
        experience: Joi.array().items(
          Joi.object({
            companyName: Joi.string().required().max(255),
            roles: Joi.array().items(roleSchema).required().min(1)
          })
        )
      }).options({ abortEarly: false });

    return schema.validate(workExperienceDetails);
}

module.exports.workExperienceDetailsSchema= workExperienceDetailsSchema;
module.exports.validateWorkExperienceDetails = validate;
module.exports.WorkExperienceDetails = WorkExperienceDetails;