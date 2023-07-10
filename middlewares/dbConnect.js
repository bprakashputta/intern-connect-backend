// external imports
const mongoose = require("mongoose");
require('dotenv').config()

async function dbConnect() {
  // use mongoose to connect this app to our database on mongoDB using the DB_URL (connection string)
  mongoose
    .connect(
        process.env.DATABASE_URL,
      {
        //   these are options to ensure that the connection is done properly
        useUnifiedTopology: true,
        useNewUrlParser: true,
        autoIndex: true, //make this also true
      }
    )
    .then(() => {
        console.log("Connected to the Internship Database!");
    })
    .catch((error) => {
      console.log("Unable to connect to Internship Database!");
      console.error(error.message);
    });
}

module.exports = dbConnect;