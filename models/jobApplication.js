const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  job_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    // ref: "User",
    required: true,
  },
  status: {
    type: String,
    default: "open",
  },
});

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

module.exports.JobApplication = JobApplication;
