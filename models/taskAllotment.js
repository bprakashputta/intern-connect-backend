const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = require("mongoose");
JoiObjectId = require("joi-objectid")(Joi);

const taskAllotmentSchema = new mongoose.Schema({
  task_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["closed", "open"],
    default: "open",
    required: true,
  },
  due_date: {
    type: Date,
    required: true,
  },
  comments: [
    {
      text: {
        type: String,
        required: true,
      },
      posted_by: {
        type: String,
        required: true,
      },
      posted_at: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const TaskAllotment = mongoose.model("TaskAllotment", taskAllotmentSchema);

module.exports.TaskAllotment = TaskAllotment;

