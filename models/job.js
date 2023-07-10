const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = require("mongoose");
JoiObjectId = require("joi-objectid")(Joi);

const jobSchema = new mongoose.Schema({
  job_id: {
    type: String,
    required: true,
  },
  role_name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  job_type: {
    type: String,
    required: true,
  },
  skills_required: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  company_id: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  status: {
    type: String,
    default: "open",
  },
});

const Job = mongoose.model("job", jobSchema);

async function validate(Job) {
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

module.exports.jobSchema = jobSchema;
module.exports.validate = validate;
module.exports.Job = Job;
