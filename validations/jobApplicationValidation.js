const Joi = require("joi");

const jobApplicationValidationSchema = async (Job) => {
  const schema = Joi.object({
    job_id: Joi.string().required(),
    user_id: Joi.string().required(),
    status: Joi.string(),
  });

  return schema.validate(Job);
};

module.exports = jobApplicationValidationSchema;
