const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  rating: {
    type: Number,
    default: 1200,
  },
});

module.exports = mongoose.model("Photo", photoSchema);
