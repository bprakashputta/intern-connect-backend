// fileUpload.js

const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3, BUCKET } = require("../middlewares/aws-config");

const router = express.Router();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET,
    key: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

router.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file);
  res.json({ fileUrl: req.file.location });
});

router.get("/list", async (req, res) => {
  let response = await s3.listObjectsV2({ Bucket: BUCKET }).promise();
  res.send(response.Contents.map((item) => item.Key));
});

router.get("/download/:filename", async (req, res) => {
  const filename = req.params.filename;
  const response = await s3
    .getObject({ Bucket: BUCKET, Key: filename })
    .promise();
  res.send(response.Body);
});

router.delete("/delete/:filename", async (req, res) => {
  const filename = req.params.filename;
  await s3.deleteObject({ Bucket: BUCKET, Key: filename }).promise();
  res.send("File Deleted Successfully");
});

module.exports = router;
