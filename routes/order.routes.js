const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/admin.middleware");

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
} = require("../controllers/order.controller");

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/cancel", protect, cancelOrder);

router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id", protect, adminOnly, updateOrderStatus);

module.exports = router;