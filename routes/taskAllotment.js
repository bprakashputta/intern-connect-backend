const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { TaskAllotment } = require("../models/taskAllotment");
const taskAllotmentValidation = require("../validations/taskAllotmentValidation");
const { ObjectId } = require("mongodb");

// Define the isAuthenticated middleware
function isAuthenticated(request, response, next) {
  next();
}

router.post("/", isAuthenticated, (req, res) => {});

// Create a new taskAllotment
router.post("/create", isAuthenticated, async (request, response) => {
  try {
    const { error } = await taskAllotmentValidation(request.body);
    console.log("Doing validation");
    if (error) {
      console.log(error);
      return response.status(400).json({ error: error.details[0].message });
    }

    const newTaskAllotment = new TaskAllotment(request.body);
    const savedTaskAllotment = await newTaskAllotment.save();

    return response.status(201).json(savedTaskAllotment);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

// Get all taskAllotments
router.get("/all", isAuthenticated, async (request, response) => {
  try {
    const taskAllotments = await TaskAllotment.find();
    return response.json(taskAllotments);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

// Get a specific taskAllotment by ID
router.get("/view/:id", isAuthenticated, async (request, response) => {
  try {
    let taskAllotmentId = request.params.id;
    const taskAllotment = await TaskAllotment.findById(taskAllotmentId);
    if (!taskAllotment) {
      return response.status(404).json({ error: "TaskAllotment not found" });
    }
    response.json(taskAllotment);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

// Update a taskAllotment by ID
router.put("/:id", isAuthenticated, async (request, response) => {
  try {
    const taskAllotmentId = request.params.id;
    const { error } = await taskAllotmentValidation(request.body);

    if (error) {
      return response.status(400).json({ error: error.details[0].message });
    }

    const updatedTaskAllotment = await TaskAllotment.findByIdAndUpdate(taskAllotmentId, request.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTaskAllotment) {
      return response.status(404).json({ message: "Task Allotment not found" });
    }

    return response.json(updatedTaskAllotment);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});


router.patch("/:id/comments", isAuthenticated, async (req, res) => {
  try {
    console.log("Inside patch");
    const taskAllotmentId = req.params.id;

    const taskAllotment = await TaskAllotment.findById(taskAllotmentId);
    if (!taskAllotment) {
      return res.status(404).json({ error: "TaskAllotment not found" });
    }

    const { error } = Joi.array()
      .items(
        Joi.object({
          text: Joi.string().required(),
          posted_by: Joi.string().required(),
        })
      )
      .validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    taskAllotment.comments.push(...req.body);

    const updatedTaskAllotment = await taskAllotment.save();

    res.json(updatedTaskAllotment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a taskAllotment by ID
router.delete("/delete/:id", isAuthenticated, async (request, response) => {
  try {
    const taskAllotment = await TaskAllotment.findByIdAndDelete(
      request.params.id
    );
    if (!taskAllotment) {
      return response.status(404).json({ error: "TaskAllotment not found" });
    }
    response.json({ message: "TaskAllotment deleted successfully" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

module.exports = router;
