const express = require('express');
const router = express.Router();
const UploadController = require('../controllers/uploadController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

router.post('/file/:projectId', auth, upload.single('file'), UploadController.uploadFile);
router.post('/youtube/:projectId', auth, UploadController.addYoutubeUrl);
router.post('/rss/:projectId', auth, UploadController.addRssFeed);
router.patch('/transcript/:projectId', auth, UploadController.updateTranscript);

module.exports = router;