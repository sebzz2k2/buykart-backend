const mongoose = require("mongoose");

const User = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isUser: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("User", User);

module.exports = model;
