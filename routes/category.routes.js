const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/admin.middleware");
const { createCategory, getCategories, deleteCategory } = require("../controllers/category.controller");

router.get("/", getCategories);

router.post("/", protect, adminOnly, createCategory);
router.delete("/:id", protect, adminOnly, deleteCategory);
module.exports = router;