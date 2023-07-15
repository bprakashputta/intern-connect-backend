// fileUpload.js

const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3, BUCKET } = require("../middlewares/aws-config");
const { ListObjectsV2Command } = require("@aws-sdk/client-s3");

const router = express.Router();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET,
    key: (req, file, cb) => {
      const userId = req.headers["user-id"]; // Assuming you have a user ID available in the request
      const folderName = `user_${userId}`;
      const fileName = file.originalname;
      const key = `${folderName}/${fileName}`;
      cb(null, key);
    },
  }),
});

router.post("/upload", upload.array("files", 5), (req, res) => {
  const fileUrls = req.files.map((file) => file.location);
  res.json({ fileUrls: fileUrls });
});

router.get("/list", async (req, res) => {
  const userId = req.headers["user-id"]; // Assuming you have a user ID available in the request
  const folderName = `user_${userId}`;
  const params = {
    Bucket: BUCKET,
    Prefix: folderName + "/",
  };

  try {
    const command = new ListObjectsV2Command(params);
    const response = await s3.send(command);
    const fileList = response.Contents.map((item) => {
      const fileName = item.Key.replace(`${folderName}/`, "");
      const fileUrl = `http://${BUCKET}.s3.amazonaws.com/${item.Key}`; // Update with your S3 bucket URL
      return { fileName, fileUrl };
    });
    res.json({ fileList: fileList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve file list" });
  }
});


router.get("/download/:filename", async (req, res) => {
  const userId = req.headers["user-id"]; // Assuming you have a user ID available in the request
  const folderName = `user_${userId}`;
  const filename = req.params.filename;
  const key = `${folderName}/${filename}`;

  try {
    const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    const response = await s3.send(command);
    res.send(response.Body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to download file" });
  }
});



router.delete("/delete/:filename", async (req, res) => {
  const userId = req.headers["user-id"]; // Assuming you have a user ID available in the request
  const folderName = `user_${userId}`;
  const filename = req.params.filename;
  const key = `${folderName}/${filename}`;

  try {
    const command = new DeleteObjectCommand({ Bucket: BUCKET, Key: key });
    await s3.send(command);
    res.send("File Deleted Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

module.exports = router;
