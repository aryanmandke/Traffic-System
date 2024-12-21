import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { format } from "date-fns";

const UserCard = ({ user, onUpdateMessage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newMessage, setNewMessage] = useState(user.message || "No message provided");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleMessageChange = (e) => setNewMessage(e.target.value);

  const handleEdit = () => {
    setIsEditing(true);
    setErrorMessage("");
  };

  const handleCancel = () => {
    setNewMessage(user.message || "No message provided");
    setIsEditing(false);
    setErrorMessage("");
  };

  const handleSave = async () => {
    if (!user.serial_no) {
      setErrorMessage("Serial number is missing.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/add-police-message",
        {
          serial_no: user.serial_no, // Include serial_no in the body
          message: newMessage,
        }
      );

      if (response.status === 200) {
        const updatedMessage = response.data.data.message || newMessage;
        setNewMessage(updatedMessage);
        setIsEditing(false);
        setErrorMessage("");

        // Notify the parent component
        if (onUpdateMessage) {
          onUpdateMessage(updatedMessage);
        }
      } else {
        throw new Error("Failed to update message. Unexpected response.");
      }
    } catch (error) {
      console.error("Error updating message:", error);
      setErrorMessage("Failed to update message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg w-72">
        <p>Loading user details...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 w-72">
      <ul className="list-group list-group-flush">
        <li className="list-group-item p-4">
          <span className="text-gray-700">
            <span className="font-medium">Serial No:</span> {user.serial_no || "N/A"}
          </span>
        </li>
        <li className="list-group-item p-4">
          <span className="text-gray-700">
            <span className="font-medium">Vehicle No:</span> {user.vehicle_no || "N/A"}
          </span>
        </li>
        <li className="list-group-item p-4">
          <span className="text-gray-700">
            <span className="font-medium">Type of Vehicle:</span> {user.type_of_vehicle || "N/A"}
          </span>
        </li>
        <li className="list-group-item p-4">
          <span className="text-gray-700">
            <span className="font-medium">Source:</span>{" "}
            {user.source?.lat && user.source?.lng
              ? `Lat: ${user.source.lat}, Lng: ${user.source.lng}`
              : "N/A"}
          </span>
        </li>
        <li className="list-group-item p-4">
          <span className="text-gray-700">
            <span className="font-medium">Destination:</span>{" "}
            {user.destination?.lat && user.destination?.lng
              ? `Lat: ${user.destination.lat}, Lng: ${user.destination.lng}`
              : "N/A"}
          </span>
        </li>
        <li className="list-group-item p-4 flex justify-between items-center">
          {isEditing ? (
            <div className="flex items-center space-x-2 w-full">
              <input
                type="text"
                value={newMessage}
                onChange={handleMessageChange}
                className="p-2 border border-gray-300 rounded-md w-full"
                placeholder="Enter new message"
                aria-label="Edit message"
                disabled={isLoading}
              />
              <button
                onClick={handleSave}
                className="text-green-500 hover:text-green-700 cursor-pointer"
                disabled={isLoading}
                aria-label="Save message"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="text-red-500 hover:text-red-700 cursor-pointer"
                aria-label="Cancel editing"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center w-full">
              <span className="text-gray-700">
                <span className="font-medium">Message:</span> {newMessage || "No message provided"}
              </span>
              <FaEdit
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={handleEdit}
                aria-label="Edit message"
              />
            </div>
          )}
        </li>
      </ul>
      {errorMessage && (
        <div className="text-center mt-4">
          <p className="text-red-500 text-sm">{errorMessage}</p>
        </div>
      )}
      <p className="text-gray-500 text-sm mt-4 border-t pt-3">
        <span className="font-medium">Joined:</span>{" "}
        {user.createdAt ? format(new Date(user.createdAt), "PPPpp") : "N/A"}
      </p>
    </div>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape({
    serial_no: PropTypes.string.isRequired,
    vehicle_no: PropTypes.string,
    type_of_vehicle: PropTypes.string,
    source: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number,
    }),
    destination: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number,
    }),
    message: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  onUpdateMessage: PropTypes.func,
};

UserCard.defaultProps = {
  onUpdateMessage: null,
};

export default UserCard;
