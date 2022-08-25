const connectDB = require("./config/db");
const express = require("express");
const filesRouter = require("./routes/files");
const showRouter = require("./routes/show");
const downloadRouter = require("./routes/download");
const path = require("path");
const app = express();

connectDB();

app.use(express.static("public"));
app.use(express.json());

// Template engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// Routes
app.use(filesRouter);
app.use(showRouter);
app.use(downloadRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
