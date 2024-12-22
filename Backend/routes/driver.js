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

// Joi Schema for validating driver data
const driverSchema = Joi.object({
  serial_no: Joi.string().required().messages({
    "string.empty": "Serial number is required.",
    "any.required": "Serial number is mandatory.",
  }),
  type_of_vehicle: Joi.string()
    .valid("ambulance", "firetruck", "other")
    .required()
    .messages({
      "string.empty": "Type of vehicle is required.",
      "any.required": "Vehicle type is mandatory.",
      "any.only": "Invalid vehicle type. Must be 'ambulance', 'firetruck', or 'other'.",
    }),
  vehicle_number: Joi.string().required().messages({
    "string.empty": "Vehicle number is required.",
    "any.required": "Vehicle number is mandatory.",
  }),
  source: Joi.object({
    lat: Joi.number().required().messages({ "any.required": "Source latitude is required." }),
    lng: Joi.number().required().messages({ "any.required": "Source longitude is required." }),
  })
    .required()
    .messages({
      "any.required": "Source location is mandatory.",
    }),
  destination: Joi.object({
    lat: Joi.number().required().messages({ "any.required": "Destination latitude is required." }),
    lng: Joi.number().required().messages({ "any.required": "Destination longitude is required." }),
  })
    .required()
    .messages({
      "any.required": "Destination location is mandatory.",
    }),
});

// Route: Add New Driver Data
router.post("/add-user-data", async (req, res) => {
  try {
    // Validate the request body using Joi schema
    const { error, value } = driverSchema.validate(req.body, { abortEarly: false });
    console.log("Post is running");
    if (error) {
      const validationErrors = error.details.map((err) => ({
        field: err.context.key,
        message: err.message,
      }));
      return sendErrorResponse(res, 400, "Validation failed for the provided data.", validationErrors);
    }

    // Check for existing driver by serial_no
    const existingDriver = await User.findOne({ serial_no: value.serial_no }).lean();
    if (existingDriver) {
      return sendErrorResponse(res, 409, "Driver with the specified serial number already exists.");
    }

    // Create a new driver record
    const driverData = new User(value);
    const savedDriver = await driverData.save();

    res.status(201).json({
      success: true,
      message: "Driver data successfully added.",
      _id: savedDriver._id,
    });
  } catch (error) {
    console.error("Error adding driver data:", error);
    return sendErrorResponse(res, 500, "Could not add driver data. Please try again later.");
  }
});

// Route: Get Driver Message by Serial Number
router.get("/get-driver-message/:serial_no", async (req, res) => {
  const { serial_no } = req.params;

  console.log("Serial Number Received:", serial_no); // Debugging

  // Check if serial_no is provided
  if (!serial_no) {
    return sendErrorResponse(res, 400, "No serial number provided.");
  }

  try {
    // Fetch driver data by serial_no
    const driver = await User.findOne({ serial_no }).lean();
    if (!driver) {
      return sendErrorResponse(res, 404, "Driver with the specified serial number not found.");
    }

    // Ensure source and destination are valid objects
    if (!driver.source || !driver.destination) {
      return sendErrorResponse(res, 400, "Source or destination data is incomplete.");
    }

    res.status(200).json({
      success: true,
      message: "Driver data retrieved successfully.",
      data: driver,
    });
  } catch (error) {
    console.error("Error retrieving driver data:", error);
    return sendErrorResponse(res, 500, "Could not retrieve driver data. Please try again later.");
  }
});

module.exports = router;
