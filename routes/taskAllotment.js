const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { TaskAllotment } = require("../models/taskAllotment");
const taskAllotmentValidation = require("../validations/taskAllotmentValidation");


// Define the isAuthenticated middleware
function isAuthenticated(request, response, next) {
  next();
}

// Use the isAuthenticated middleware in your route handler
router.post("/", isAuthenticated, (req, res) => {
  // Handle the POST request logic for the authenticated route here
});

// Create a new taskAllotment
router.post("/create", isAuthenticated, async (request, response) => {
  try {
    const { error } = await taskAllotmentValidation(request.body);
    console.log("Doing validation");
    if (error) {
      console.log(error);
      return response.status(400).json({ error: error.details[0].message });
    }
    // Generate taskAllotment id using generate taskAllotment id function
    console.log("Schema sent in request body is valid");
    console.log(request.body);

    const newTaskAllotment = new TaskAllotment(request.body);
    const savedTaskAllotment = await newTaskAllotment.save();

    return response.status(201).json(savedTaskAllotment);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

// Get all companies
router.get("/all", isAuthenticated, async (request, response) => {
  try {
    const companies = await TaskAllotment.find();
    return response.json(companies);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

// Get a specific taskAllotment by ID
router.get("/view/:id", isAuthenticated, async (request, response) => {
  try {
    console.log(request.params)
    let taskAllotmentId = request.params.id;
    console.log(taskAllotmentId);
    const taskAllotment = await TaskAllotment.findById(taskAllotmentId);
    console.log(taskAllotment.taskAllotmentId);
    if (!taskAllotment) {
      return response.status(404).json({ error: "TaskAllotment not found" });
    }
    response.json(taskAllotment);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

// Get a specific taskAllotment by ID
router.get("/:id", isAuthenticated, async (request, response) => {
  try {
    let taskAllotmentId = request.params.id;
    console.log(taskAllotmentId);
    const taskAllotment = await TaskAllotment.findById(taskAllotmentId);
    console.log(taskAllotment.taskAllotmentId);
    if (!taskAllotment) {
      return response.status(404).json({ error: "TaskAllotment not found" });
    }
    response.json({ taskAllotment });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

// Update a taskAllotment by ID
router.put("/:id", isAuthenticated, async (request, response) => {
  try {
    console.log("Received Edit request bhanu");
    const { error } = await taskAllotmentValidation(request.body);
    if (error) {
      console.log(error);
      return response.status(400).json({ error: error.details[0].message });
    }
    // console.log(request.body);
    const taskAllotment = await TaskAllotment.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!taskAllotment) {
      return response.status(404).json({ error: "TaskAllotment not found" });
    }
    response.json(taskAllotment);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});


router.put("/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;

    // Update the task allotment document with the new comments
    const updatedTaskAllotment = await TaskAllotment.findByIdAndUpdate(
      id,
      { comments },
      { new: true }
    );

    if (!updatedTaskAllotment) {
      return res.status(404).json({ error: "Task allotment not found" });
    }

    // Return the updated task allotment document as the response
    res.json(updatedTaskAllotment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
})


// Delete a taskAllotment by ID
router.delete("/delete/:id", isAuthenticated, async (request, response) => {
  try {
    const taskAllotment = await TaskAllotment.findByIdAndDelete(request.params.id);
    if (!taskAllotment) {
      return response.status(404).json({ error: "TaskAllotment not found" });
    }
    response.json({ message: "TaskAllotment deleted successfully" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

module.exports = router;
