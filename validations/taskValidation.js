const Joi = require("joi");

const taskValidation = (task) => {
  const schema = Joi.object({
    task_id: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    job_id: JoiObjectId().required(),
    status: Joi.string().valid("closed", "open").required(),
    created_at: Joi.date().default(Date.now),
    updated_at: Joi.date().default(Date.now),
    due_date: Joi.date().required(),
    attachments: Joi.array()
      .items(
        Joi.object({
          filename: Joi.string().required(),
          path: Joi.string().required(),
        })
      ),
  });

  return schema.validate(task);
};

module.exports = taskValidation;
