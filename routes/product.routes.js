const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/admin.middleware");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addStock,
} = require("../controllers/product.controller");

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

router.put("/:id/stock", protect, adminOnly, addStock);

module.exports = router;