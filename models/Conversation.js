const mongoose = require("mongoose");

const ConvertionSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConvertionSchema);
