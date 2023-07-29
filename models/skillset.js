const mongoose = require('mongoose');
const Joi = require('joi');

const skillsetSchema = new mongoose.Schema({
  skills: {
    type: [
      {
        name: {
          type: String,
          required: true,
          maxlength: 100,
        },
        proficiency: {
          type: String,
          enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
          default: 'Beginner',
        },
      },
    ],
    required: true,
    validate: [(v) => Array.isArray(v) && v.length > 0, 'Skills array must contain at least one skill.'],
  },
});

const Skillset = mongoose.model('Skillset', skillsetSchema);


async function validate(skillsetSchema){
    // Joi validation schema
    const schema = Joi.object({
        skills: Joi.array()
        .items(
            Joi.object({
            name: Joi.string().required().max(100),
            proficiency: Joi.string().valid('Beginner', 'Intermediate', 'Advanced', 'Expert').default('Beginner'),
            })
        )
        .required()
        .min(1),
    }).options({ abortEarly: false });
    // validate schema
    return schema.validate(skillsetSchema);
}

module.exports = { Skillset, validate };
