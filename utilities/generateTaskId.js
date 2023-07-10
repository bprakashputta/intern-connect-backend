const { Task } = require("../models/task");

async function generateTaskId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = 6;

  while (true) {
    let taskId = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      taskId += characters.charAt(randomIndex);
    }

    const existingTask = await Task.findOne({ taskId });

    if (!existingTask) {
      return TaskId;
    }
  }
}

module.exports = generateTaskId;
