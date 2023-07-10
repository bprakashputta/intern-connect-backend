const Joi = require("joi");

const taskValidationSchema = Joi.object({
  task_id: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  assigned_by: Joi.string().required(),
  assigned_to: Joi.array().items(Joi.string().required()).required(),
  status: Joi.string().valid("open", "closed").required(),
  due_date: Joi.date().required(),
  created_at: Joi.date().default(Date.now),
  updated_at: Joi.date().default(Date.now),
  comments: Joi.array().items(
    Joi.object({
      text: Joi.string().required(),
      posted_by: Joi.string().required(),
      posted_at: Joi.date().default(Date.now),
    })
  ),
  attachments: Joi.array().items(
    Joi.object({
      filename: Joi.string().required(),
      path: Joi.string().required(),
    })
  ),
});

module.exports = taskValidationSchema;
