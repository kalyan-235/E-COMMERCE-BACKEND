const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    image: {
      type: String,
      default: "https://via.placeholder.com/300x200?text=Category",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);