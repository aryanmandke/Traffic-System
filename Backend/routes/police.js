const router = require("express").Router();
const Joi = require("joi");
const User = require("../models/user");

// Utility: Send standardized error response
const sendErrorResponse = (res, status, message, details = []) => {
  res.status(status).json({
    success: false,
    message,
    errors: details,
  });
};

// Validation Schemas
const messageSchema = Joi.object({
  serial_no: Joi.string().required().messages({
    "string.empty": "Serial number is required.",
    "any.required": "Serial number is mandatory.",
  }),
  message: Joi.string().required().messages({
    "string.empty": "Message is required.",
    "any.required": "Message is mandatory.",
  }),
});

const locationSchema = Joi.object({
  serial_no: Joi.string().required().messages({
    "string.empty": "Serial number is required.",
    "any.required": "Serial number is mandatory.",
  }),
  source: Joi.object({
    lat: Joi.number().required().messages({ "any.required": "Source latitude is required." }),
    lng: Joi.number().required().messages({ "any.required": "Source longitude is required." }),
  }).required(),
  destination: Joi.object({
    lat: Joi.number().required().messages({ "any.required": "Destination latitude is required." }),
    lng: Joi.number().required().messages({ "any.required": "Destination longitude is required." }),
  }).required(),
});

// Route: Get all driver data
router.get("/get-user-data", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select("-__v").lean();

    const userData = users.map((user) => ({
      serial_no: user.serial_no,
      type_of_vehicle: user.type_of_vehicle,
      vehicle_number: user.vehicle_number,
      source: user.source ? `${user.source.lat}, ${user.source.lng}` : "N/A",
      destination: user.destination ? `${user.destination.lat}, ${user.destination.lng}` : "N/A",
      message: user.message || "No message provided.",
    }));

    res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      data: userData,
    });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    sendErrorResponse(res, 500, "Failed to fetch user data.");
  }
});

// Route: Add a police message to a driver
router.post("/add-police-message", async (req, res) => {
  try {
    const { error, value } = messageSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return sendErrorResponse(res, 400, "Validation failed.", error.details);
    }

    const updatedUser = await User.findOneAndUpdate(
      { serial_no: value.serial_no },
      { message: value.message },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return sendErrorResponse(res, 404, "Driver not found.");
    }

    res.status(200).json({
      success: true,
      message: "Police message added successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error adding police message:", error.message, { body: req.body });
    sendErrorResponse(res, 500, "Failed to add police message.");
  }
});

// Route: Get live location of a specific driver or all drivers
router.get("/get-live-location/:serial_no?", async (req, res) => {
  try {
    const { serial_no } = req.params;

    if (serial_no) {
      const driver = await User.findOne({ serial_no }).select("source destination").lean();
      if (!driver) {
        return sendErrorResponse(res, 404, "Driver not found.");
      }

      return res.status(200).json({
        success: true,
        message: "Live location fetched successfully.",
        data: { source: driver.source, destination: driver.destination },
      });
    }

    const drivers = await User.find().select("source destination").lean();
    res.status(200).json({
      success: true,
      message: "Live locations fetched successfully.",
      data: drivers,
    });
  } catch (error) {
    console.error("Error fetching live locations:", error.message, { serial_no });
    sendErrorResponse(res, 500, "Failed to fetch live locations.");
  }
});

// Route: Update driver's source or destination
router.post("/update-location", async (req, res) => {
  try {
    const { error, value } = locationSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return sendErrorResponse(res, 400, "Validation failed.", error.details);
    }

    const updatedUser = await User.findOneAndUpdate(
      { serial_no: value.serial_no },
      { source: value.source, destination: value.destination },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return sendErrorResponse(res, 404, "Driver not found.");
    }

    res.status(200).json({
      success: true,
      message: "Source and destination updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating location:", error.message, { body: req.body });
    sendErrorResponse(res, 500, "Failed to update source or destination.");
  }
});

module.exports = router;
