const express = require("express");
const router = express.Router();
const passport = require("passport");
const Joi = require("joi");
const { Job } = require("../models/job");
const { JobApplication } = require("../models/jobApplication");
const { Task } = require("../models/task");
const { User } = require("../models/user");
const jobValidation = require("../validations/jobValidation");
const generateJobId = require("../utilities/generateJobId");

// Define the isAuthenticated middleware
function isAuthenticated(request, response, next) {
  next();
}

// Get a specific job with applied status by ID for a specific user
router.get(
  "/user/:user_id/view/:job_id/",
  isAuthenticated,
  async (request, response) => {
    try {
      console.log("user/view/:id");
      const job_id = request.params.job_id;
      const userId = request.params.userId;

      const jobDetails = await Job.findOne({ job_id });

      if (!jobDetails) {
        return response.status(404).json({ message: "Job not found" });
      }

      const jobApplication = await JobApplication.findOne({
        job_id: jobDetails.job_id,
        user_id: userId,
      });
      if (jobApplication) {
        const job = {
          ...jobDetails.toObject(),
          applied: true,
        };
        console.log("job With applied status", job);
        response.json({ job });
      } else {
        const job = {
          ...jobDetails.toObject(),
          applied: false,
        };
        console.log("job With applied status", job);
        response.json({ job });
      }
    } catch (error) {
      response.status(500).json({ message: "Failed to retrieve job", error });
    }
  }
);

// Get all user details applied for a specific job
router.get("/:jobid/appliedby", async (request, response) => {
  try {
    let jobId = request.params.jobid;
    const Jobs = await JobApplication.find({ job_id: jobId });
    const userIds = Jobs.map((job) => job.user_id);
    const users = await User.find({ _id: userIds }).select(
      "firstName lastName email profilePhoto"
    );
    response.json({ users: users });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

// Get all jobs with applied status for a specific user
router.get("/all/:userId", async (request, response) => {
  try {
    const userId = request.params.userId;

    const jobs = await Job.find({});
    const JobsWithStatus = [];

    for (const job of jobs) {
      const jobApplication = await JobApplication.findOne({
        job_id: job.job_id,
        user_id: userId,
      });
      if (jobApplication) {
        const jobWithAppliedStatus = {
          ...job.toObject(),
          applied: true,
        };
        JobsWithStatus.push(jobWithAppliedStatus);
      } else {
        const jobWithAppliedStatus = {
          ...job.toObject(),
          applied: false,
        };
        JobsWithStatus.push(jobWithAppliedStatus);
      }
    }

    response.json(JobsWithStatus);
  } catch (error) {
    response.status(500).json({ error: "Server error" });
  }
});

// Jobs pagination
router.get("/show/:userId", async (req, res) => {
  const userId = req.params.userId;

  const { pageNumber = 1, keyword, cat, location, skills } = req.query;
  const query = {};
  if (keyword) {
    query.role_name = { $regex: keyword, $options: "i" };
  }
  if (cat) {
    query.job_type = { $regex: cat, $options: "i" };
  }
  if (location) {
    query.location = { $regex: location, $options: "i" };
  }
  if (skills) {
    query.skills_required = { $in: skills.split(",") };
  }
  console.log(query);
  const totalJobs = await Job.countDocuments(query);

  // Pagination
  const pageSize = 5; // Number of jobs per page
  const totalPages = Math.ceil(totalJobs / pageSize);

  const jobsForPage = await Job.find(query)
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  const JobsWithStatus = [];

  for (const job of jobsForPage) {
    const jobApplication = await JobApplication.findOne({
      job_id: job.job_id,
      user_id: userId,
    });
    if (jobApplication) {
      const jobWithAppliedStatus = {
        ...job.toObject(),
        applied: true,
      };
      JobsWithStatus.push(jobWithAppliedStatus);
    } else {
      const jobWithAppliedStatus = {
        ...job.toObject(),
        applied: false,
      };
      JobsWithStatus.push(jobWithAppliedStatus);
    }
  }

  res.json({
    totalJobs,
    pages: totalPages,
    currentPage: pageNumber,
    jobs: JobsWithStatus,
  });
});

// Get all tasks related to a specific Job
router.get("/:jobid/tasks/all", async (request, response) => {
  try {
    const tasks = await Task.find({ job_id: request.params.jobid });
    return response.json({ tasks: tasks });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

// Use the isAuthenticated middleware in your route handler
router.post("/", isAuthenticated, (req, res) => {
  // Handle the POST request logic for the authenticated route here
});

// Create a new job
router.post("/create", async (request, response) => {
  try {
    const { error } = await jobValidation(request.body);
    if (error) {
      console.log(error);
      return response.status(400).json({ error: error.details[0].message });
    }
    // Generate job id using generate job id function
    let jobId = await generateJobId();

    request.body.job_id = jobId;

    const newJob = new Job(request.body);
    const savedJob = await newJob.save();
    return response.status(201).json(savedJob);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

// Get all jobs
router.get("/all", async (request, response) => {
  try {
    const jobs = await Job.find();
    return response.json(jobs);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

// Get a specific job by ID
router.get("/view/:id", isAuthenticated, async (request, response) => {
  try {
    const job_id = request.params.id;

    const job = await Job.findOne({ job_id });

    if (!job) {
      return response.status(404).json({ message: "Job not found" });
    }

    response.json({ job });
  } catch (error) {
    response.status(500).json({ message: "Failed to retrieve job", error });
  }
});

// Update a job by ID
router.put("/:id", isAuthenticated, async (request, response) => {
  try {
    const jobId = request.params.id;
    const { error } = await jobValidation(request.body);

    if (error) {
      return response.status(400).json({ error: error.details[0].message });
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, request.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedJob) {
      return response.status(404).json({ message: "Job not found" });
    }

    return response.json(updatedJob);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

// Delete a job by ID
router.delete("/delete/:id", isAuthenticated, async (request, response) => {
  try {
    const jobId = request.params.id;

    const job = await Job.findByIdAndDelete(jobId);

    if (!job) {
      return response.status(404).json({ message: "Job not found" });
    }

    response.json({ message: "Job deleted successfully" });
  } catch (error) {
    response.status(500).json({ message: "Failed to delete job", error });
  }
});

module.exports = router;
