const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    serial_no: {
      type: String,
      required: [true, "Serial number is required."],
      unique: true, // Ensures no duplicate serial numbers
      trim: true, // Removes extra spaces
    },
    type_of_vehicle: {
      type: String,
      required: [true, "Type of vehicle is required."],
      enum: {
        values: ["ambulance", "firetruck", "other"], // Restrict to specific types
        message: "Invalid type of vehicle. Must be 'ambulance', 'firetruck', or 'other'.",
      },
    },
    vehicle_number: {
      type: String,
      required: [true, "Vehicle number is required."],
      trim: true,
      unique: true, // Ensures no duplicate vehicle numbers
    },
    source: {
      lat: {
        type: Number,
        required: [true, "Source latitude is required."],
        validate: {
          validator: (value) => value >= -90 && value <= 90,
          message: "Source latitude must be between -90 and 90.",
        },
      },
      lng: {
        type: Number,
        required: [true, "Source longitude is required."],
        validate: {
          validator: (value) => value >= -180 && value <= 180,
          message: "Source longitude must be between -180 and 180.",
        },
      },
    },
    destination: {
      lat: {
        type: Number,
        required: [true, "Destination latitude is required."],
        validate: {
          validator: (value) => value >= -90 && value <= 90,
          message: "Destination latitude must be between -90 and 90.",
        },
      },
      lng: {
        type: Number,
        required: [true, "Destination longitude is required."],
        validate: {
          validator: (value) => value >= -180 && value <= 180,
          message: "Destination longitude must be between -180 and 180.",
        },
      },
    },
    message: {
      type: String,
      default: "No message provided.", // Default message if none is provided
      trim: true,
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Ensure unique combination of `serial_no` and `vehicle_number` for integrity
userSchema.index({ serial_no: 1, vehicle_number: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
