import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import MapView from "./MapView";

const DisplayDriver = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { serial_no } = location.state || {}; // Extract serial_no from state
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);

  // Fetch driver data
  const fetchData = async () => {
    if (!serial_no) {
      setError("No serial number provided. Please go back and enter a valid serial number.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/v1/get-driver-message/${serial_no}`
      );

      if (response.status === 200 && response.data.success) {
        const fetchedData = response.data.data;
        console.log("Fetched Data:", fetchedData);

        setData(fetchedData);
        setSource(fetchedData.source || null);
        setDestination(fetchedData.destination || null);
        setError(""); // Clear error if successful
      } else {
        setError(response.data.message || "Unexpected response from the server.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.response?.data?.message || "Failed to fetch driver data.");
    } finally {
      setLoading(false);
    }
  };

  // Effect: Fetch driver data on component mount and refresh periodically
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh data every 5 seconds
    return () => clearInterval(interval); // Clean up on component unmount
  }, [serial_no]);

  // Handle source location change
  const handleSourceChange = (latLng) => {
    setSource(latLng);
    console.log("Updated Source:", latLng);
  };

  // Handle destination location change
  const handleDestinationChange = (latLng) => {
    setDestination(latLng);
    console.log("Updated Destination:", latLng);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          width: "90%",
          maxWidth: "500px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Driver Details</h2>

        {/* Error Message */}
        {error && (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "red" }}>{error}</p>
            <button
              onClick={fetchData}
              style={{
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && <p>Loading driver details...</p>}

        {/* Driver Data */}
        {!loading && data && !error && (
          <>
            <p>
              <strong>Serial No:</strong> {data.serial_no || "N/A"}
            </p>
            <p>
              <strong>Type of Vehicle:</strong> {data.type_of_vehicle || "N/A"}
            </p>
            <p>
              <strong>Vehicle Number:</strong> {data.vehicle_number || "N/A"}
            </p>
            <p>
              <strong>Source:</strong>{" "}
              {source ? `${source.lat}, ${source.lng}` : "N/A"}
            </p>
            <p>
              <strong>Destination:</strong>{" "}
              {destination ? `${destination.lat}, ${destination.lng}` : "N/A"}
            </p>
            <p>
              <strong>Traffic Department's Message:</strong>{" "}
              {data.message || "N/A"}
            </p>
          </>
        )}

        {/* MapView */}
        {source && destination && (
          <MapView
            locations={{ source, destination }}
            onSourceChange={handleSourceChange}
            onDestinationChange={handleDestinationChange}
          />
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate("/", { replace: true })}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default DisplayDriver;
