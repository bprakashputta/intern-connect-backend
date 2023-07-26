const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { JobApplication } = require("../models/jobApplication");
const { Job } = require("../models/job");
const jobApplicationValidation = require("../validations/jobApplicationValidation");

// Define the isAuthenticated middleware
function isAuthenticated(request, response, next) {
  next();
}

// Get all jobApplications by a specific user
router.get("/appliedby/:id", async (request, response) => {
  try {
    let userId = request.params.id;
    const appliedJobs = await JobApplication.find({
      user_id: userId,
    });

    if (!appliedJobs) {
      return response.status(404).json({ error: "JobApplications not found" });
    }
    const jobIds = appliedJobs.map((job) => job.job_id);

    const jobs = await Job.find({
      job_id: { $in: jobIds },
    });
    
    response.json({jobs: jobs});
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});


// Use the isAuthenticated middleware in your route handler
router.post("/", isAuthenticated, (req, res) => {
  // Handle the POST request logic for the authenticated route here
});

// Create a new jobApplication
router.post("/create", async (request, response) => {
  try {
    console.log("Inside create jobApplication");
    const { error } = await jobApplicationValidation(request.body);
    console.log("Doing validation");
    if (error) {
      console.log(error);
      return response.status(400).json({ error: error.details[0].message });
    }
    // Generate jobApplication id using generate jobApplication id function
    console.log("Schema sent in request body is valid");
    console.log(request.body);

    const newJobApplication = new JobApplication(request.body);
    const savedJobApplication = await newJobApplication.save();

    return response.status(201).json(savedJobApplication);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

// Get all companies
router.get("/all", isAuthenticated, async (request, response) => {
  try {
    const companies = await JobApplication.find();
    return response.json(companies);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

// Get a specific jobApplication by ID
router.get("/view/:id", isAuthenticated, async (request, response) => {
  try {
    let jobApplicationId = request.params.id;
    console.log(jobApplicationId);
    const jobApplication = await JobApplication.findOne({ jobApplicationId: jobApplicationId });
    console.log(jobApplication.jobApplicationId);
    if (!jobApplication) {
      return response.status(404).json({ error: "JobApplication not found" });
    }
    response.json(jobApplication);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

// Get a specific jobApplication by ID
router.get("/:id", isAuthenticated, async (request, response) => {
  try {
    let jobApplicationId = request.params.id;
    console.log("inside job Application get by id",jobApplicationId);
    const jobApplication = await JobApplication.findById(jobApplicationId);
    console.log(jobApplication.jobApplicationId);
    if (!jobApplication) {
      return response.status(404).json({ error: "JobApplication not found" });
    }
    response.json({ jobApplication });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

// Update a jobApplication by ID
router.put("/:id", isAuthenticated, async (request, response) => {
  try {
    console.log("Received Edit request bhanu");
    const { error } = await jobApplicationValidation(request.body);
    if (error) {
      console.log(error);
      return response.status(400).json({ error: error.details[0].message });
    }
    // console.log(request.body);
    const jobApplication = await JobApplication.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!jobApplication) {
      return response.status(404).json({ error: "JobApplication not found" });
    }
    response.json(jobApplication);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});


// Delete a jobApplication by jobID and userID
router.delete("/delete", isAuthenticated, async (request, response) => {
  try {
    const jobId = request.query.job_id;
    const userId = request.query.user_id;

    if (!jobId || !userId) {
      return response.status(400).json({ error: "Missing job ID or user ID" });
    }

    const jobApplication = await JobApplication.findOneAndDelete({
      job_id: jobId,
      user_id: userId,
    });

    if (!jobApplication) {
      return response.status(404).json({ error: "JobApplication not found" });
    }

    response.json({ message: "JobApplication deleted successfully" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});




module.exports = router;
