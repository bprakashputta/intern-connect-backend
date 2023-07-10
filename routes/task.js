const express = require("express");
const router = express.Router();
const passport = require("passport");
const Joi = require("joi");
const { Task } = require("../models/task");
const taskValidation = require("../validations/taskValidation");
const generateTaskId = require("../utilities/generateTaskId");

// Define the isAuthenticated middleware
function isAuthenticated(request, response, next) {
  next();
}

// Get all tasks
router.get("/all", async (request, response) => {
  try {
    console.log("Requested - GET ALL TASKS");
    const tasks = await Task.find();
    return response.json({tasks: tasks});
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});



// Use the isAuthenticated middleware in your route handler
router.post("/", isAuthenticated, (req, res) => {
  // Handle the POST request logic for the authenticated route here
});

// Create a new task
router.post("/create", isAuthenticated, async (request, response) => {
  try {
    // const { error } = await taskValidation(request.body);
    // if (error) {
    //   console.log(error);
    //   return response.status(400).json({ error: error.details[0].message });
    // }
    // Generate task id using generate task id function
    let taskId = await generateTaskId();

    request.body.taskId = taskId;
    console.log(request.body);

    const newTask = new Task(request.body);
    const savedTask = await newTask.save();
    console.log("new task is created")
    return response.status(201).json(savedTask);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

// Get a specific task by ID
router.get("/view/:id", isAuthenticated, async (request, response) => {
  try {
    const task_id = request.params.id;

    const task = await Task.findOne({ task_id });

    if (!task) {
      return response.status(404).json({ message: "Task not found" });
    }

    response.json({ task });
  } catch (error) {
    response.status(500).json({ message: "Failed to retrieve task", error });
  }
});

// Update a task by ID
router.put("/:id", isAuthenticated, async (request, response) => {
  try {
    const taskId = request.params.id;
    const { error } = await taskValidation(request.body);

    if (error) {
      return response.status(400).json({ error: error.details[0].message });
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, request.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return response.status(404).json({ message: "Task not found" });
    }

    return response.json(updatedTask);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

// Delete a task by ID
router.delete("/delete/:id", isAuthenticated, async (request, response) => {
  try {
    const taskId = request.params.id;

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return response.status(404).json({ message: "Task not found" });
    }

    response.json({ message: "Task deleted successfully" });
  } catch (error) {
    response.status(500).json({ message: "Failed to delete task", error });
  }
});

module.exports = router;
