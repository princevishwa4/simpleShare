const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../services/emailService");

let storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, "uploads/"),
  filename: (req, file, callback) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    callback(null, uniqueName);
  },
});

let upload = multer({ storage, limits: { fileSize: 1000000 * 100 } }).single(
  "myfile"
);

router.post("/api/files", (req, res) => {
  // Store file
  upload(req, res, async (err) => {
    // Validate request
    if (!req.file)
      return res.status(400).json({ error: "Please select file." });

    if (err) return res.status(500).send({ error: err.message });

    // Store in database
    let file = new File({
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      uuid: uuidv4(),
    });

    const response = await file.save();
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });
});

router.post("/api/files/send", async (req, res) => {
  const { uuid, emailFrom, emailTo } = req.body;

  // Validate data
  if (!uuid || !emailFrom || !emailTo)
    return res.status(422).send({ error: "All fields are required." });

  // Get data from database
  const file = await File.findOne({ uuid: uuid });
  if (file.sender && file.receiver)
    return res.status(422).send({ error: "File already sent." });

  file.sender = emailFrom;
  file.receiver = emailTo;
  const response = await file.save();

  // Send email
  sendEmail({
    from: emailFrom,
    to: emailTo,
    subject: "simpleShare file sharing",
    text: `${emailFrom} has shared a file with you.`,
    html: require("../services/emailTemplate")({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
      size: parseInt(file.size / 1000) + "KB",
      expires: "24 hours",
    }),
  });

  return res.status(200).send({ success: true });
});

module.exports = router;
