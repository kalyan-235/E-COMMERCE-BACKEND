const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/admin.middleware");
const upload = require("../middleware/upload.middleware");
const { uploadImage } = require("../controllers/upload.controller");

router.post("/", protect, adminOnly, upload.single("image"), uploadImage);

module.exports = router;