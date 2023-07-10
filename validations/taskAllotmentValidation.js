const Joi = require("joi");

const taskAllotmentValidationSchema = async (Job) => {
  const schema = Joi.object({
    task_id: Joi.string().required(),
    user_id: JoiObjectId().required(),
    status: Joi.string().valid("closed", "open").default("open").required(),
    due_date: Joi.date().required(),
    comments: Joi.array().items(
      Joi.object({
        text: Joi.string().required(),
        posted_by: Joi.string().required(),
        posted_at: Joi.date().default(Date.now),
      })
    ),
  });

  return schema.validate(Job);
};

module.exports = taskAllotmentValidationSchema;
