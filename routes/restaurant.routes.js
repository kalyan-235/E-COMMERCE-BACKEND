const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

const {
  createRestaurant,
  getRestaurants,
} = require("../controllers/restaurant.controller");

router.get("/", getRestaurants);
router.post("/", auth, role("admin"), createRestaurant);

module.exports = router;
