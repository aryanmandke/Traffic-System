const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    serial_no: {
      type: String,
      required: [true, "Serial number is required."],
      default: "12345",
    },
    type_of_vehicle: {
      type: String,
      required: [true, "Type of vehicle is required."],
    },
    vehicle_number: {
      type: String,
      required: [true, "Vehicle number is required."],
    },
    source: {
      lat: {
        type: Number,
        required: [true, "Source latitude is required."],
      },
      lng: {
        type: Number,
        required: [true, "Source longitude is required."],
      },
    },
    destination: {
      lat: {
        type: Number,
        required: [true, "Destination latitude is required."],
      },
      lng: {
        type: Number,
        required: [true, "Destination longitude is required."],
      },
    },
    message: {
      type: String,
      default: "No message provided.", // Set a default message
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps automatically
);

module.exports = mongoose.model("User", userSchema);
