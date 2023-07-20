const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3, BUCKET } = require("../middlewares/aws-config");
const {
  ListObjectsV2Command,
  DeleteObjectsCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const router = express.Router();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET,
    key: (req, file, cb) => {
      const userId = req.headers["user-id"];
      const folderName = req.params.folderName || `user_${userId}`; 
      const fileName = file.originalname;
      const key = `${folderName}/${fileName}`;
      cb(null, key);
    },
  }),
});

router.post("/upload/:folderName?", upload.array("files", 5), (req, res) => {
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


router.get("/list/:folderName", async (req, res) => {
  const userId = req.headers["user-id"]; // Assuming you have a user ID available in the request
  const folderName = req.params.folderName;
  const params = {
    Bucket: BUCKET,
    Prefix: `${folderName}/`, // Include the folderName in the prefix
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

router.delete("/delete/:folderName/:fileName", async (req, res) => {
  const folderName = req.params.folderName;
  const fileName = req.params.fileName;
  const key = `${folderName}/${fileName}`;

  try {
    const params = {
      Bucket: BUCKET,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

router.delete("/delete-all/:folderName", async (req, res) => {
  const folderName = req.params.folderName;
  const prefix = `${folderName}/`;

  try {
    const listParams = {
      Bucket: BUCKET,
      Prefix: prefix,
    };
    const listCommand = new ListObjectsV2Command(listParams);
    const listResponse = await s3.send(listCommand);

    if (listResponse.Contents.length === 0) {
      return res.json({
        message: "No files to delete in the specified folder",
      });
    }

    const keys = listResponse.Contents.map((item) => ({ Key: item.Key }));

    const deleteParams = {
      Bucket: BUCKET,
      Delete: { Objects: keys },
    };
    const deleteCommand = new DeleteObjectsCommand(deleteParams);
    await s3.send(deleteCommand);

    res.json({
      message: "All files in the specified folder deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete files" });
  }
});


// router.delete("/delete/:filename", async (req, res) => {
//   const userId = req.headers["user-id"]; // Assuming you have a user ID available in the request
//   const folderName = `user_${userId}`;
//   const filename = req.params.filename;
//   const key = `${folderName}/${filename}`;

//   try {
//     const command = new DeleteObjectCommand({ Bucket: BUCKET, Key: key });
//     await s3.send(command);
//     res.send("File Deleted Successfully");
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to delete file" });
//   }
// });

module.exports = router;
