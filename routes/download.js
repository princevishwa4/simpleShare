const router = require("express").Router();
const File = require("../models/file");

router.get("/file/download/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file)
      return res.render("download", { error: "Link is invalid or expired." });

    const filePath = `${__dirname}/../${file.path}`;
    res.download(filePath);
  } catch (err) {
    return res.render("download", { error: "Something went wrong." });
  }
});

module.exports = router;