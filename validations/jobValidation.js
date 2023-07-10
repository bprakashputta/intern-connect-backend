const Joi = require("joi");

const jobValidationSchema = async (Job) => {
  const schema = Joi.object({
    job_id: Joi.string().required(),
    role_name: Joi.string().required(),
    location: Joi.string().required(),
    job_type: Joi.string().required(),
    skills_required: Joi.array().items(Joi.string()).required(),
    description: Joi.string().required(),
    company_id: Joi.string().required(),
  });

  return schema.validate(Job);
};

module.exports = jobValidationSchema;
