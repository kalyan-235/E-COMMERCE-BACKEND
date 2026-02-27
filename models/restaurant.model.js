const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: String,
    location: String,
    image: String,
    category: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
