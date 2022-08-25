require("dotenv").config();
const mongoose = require("mongoose");

function connectDB() {
  mongoose.connect(process.env.MONGO_CONNECTION_URL);

  const con = mongoose.connection;

  con.on("open", function () {
    console.log("Database connected.");
  });
}

module.exports = connectDB;
