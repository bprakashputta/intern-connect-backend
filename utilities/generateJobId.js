const { Job } = require("../models/job");

async function generateJobId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = 6;

  while (true) {
    let jobId = "JOB";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      jobId += characters.charAt(randomIndex);
    }

    const existingJob = await Job.findOne({ job_id: jobId });
    console.log("existing job: ", existingJob)

    if (!existingJob) {
      return jobId;
    }
  }
}


module.exports = generateJobId;
