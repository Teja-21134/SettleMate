const mongoose = require("mongoose");

const satyavammaSchema =
  new mongoose.Schema(
    {
      username: {
        type: String,
        required: true,
      },

      date: {
        type: String,
        required: true,
      },

      item: {
        type: String,
        required: true,
      },

      weight: {
        type: Number,
        required: true,
      },

      rate: {
        type: Number,
        required: true,
      },

      amount: {
        type: Number,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Satyavamma",
    satyavammaSchema
  );