const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = require("mongoose");
JoiObjectId = require("joi-objectid")(Joi);

const taskSchema = new mongoose.Schema({
  task_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  job_id: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  status: {
    type: String,
    enum: ["closed", "open"],
    default: "open",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  due_date: {
    type: Date,
    required: true,
  },
  attachments: [
    {
      filename: {
        type: String,
        required: true,
      },
      path: {
        type: String,
        required: true,
      },
    },
  ],
});

const Task = mongoose.model("task", taskSchema);

async function validate(Task) {
  // TODO: HAVE TO WRITE VALIDATION SCHEMA FOR Job
  // const schema = Joi.object({
  //     name: Joi.string().required().min(5).max(255),
  //     emailId: Joi.string().max(255).required().email(),
  //     // password: Joi.string().required().min(8).max(255),
  //     isAdmin: Joi.boolean(),
  //     resumelink: Joi.string().max(500)
  // });
  //
  // return schema.validate(profile);
}

module.exports.taskSchema = taskSchema;
module.exports.validate = validate;
module.exports.Task = Task;
