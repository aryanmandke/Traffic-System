import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';

const VehicleForm = () => {
  const navigate = useNavigate();
  const [vehicleType, setVehicleType] = useState('');
  const [serialNo, setSerialNo] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [source, setSource] = useState({ lat: null, lng: null });
  const [destination, setDestination] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(false);
  const [mapError, setMapError] = useState(false);

  const mapContainerStyle = {
    height: '400px',
    width: '100%',
    borderRadius: '8px',
    marginTop: '15px',
  };

  const center = location.lat && location.lng ? location : { lat: 19.022237, lng: 72.856052 };

  const handleMapClick = (e) => {
    setDestination({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  };

  const validateInputs = () => {
    if (!serialNo.trim() || !vehicleType || !vehicleNumber.trim()) {
      setErrorMessage("Please fill in all fields.");
      return false;
    }

    if (!source.lat || !source.lng) {
      setErrorMessage("Source location is required.");
      return false;
    }

    if (!destination.lat || !destination.lng) {
      setErrorMessage("Destination location is required.");
      return false;
    }

    return true;
  };

  const handleStart = async () => {
    setErrorMessage('');
    setLoading(true);

    if (!validateInputs()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/v1/add-user-data', {
        serial_no: serialNo,
        type_of_vehicle: vehicleType,
        vehicle_number: vehicleNumber,
        source,
        destination,
      });

      const { _id } = response.data;
      navigate('/display-driver', { state: { _id } });
    } catch (error) {
      console.error('Error submitting vehicle data:', error);
      setErrorMessage('Failed to submit vehicle data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setSource({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          setErrorMessage(
            error.code === 1
              ? 'Location access denied. Please allow location access.'
              : 'Failed to retrieve location.'
          );
        }
      );
    } else {
      setErrorMessage('Geolocation is not supported by this browser.');
    }
  }, []);

  const isStartDisabled =
    !vehicleType || !serialNo || !vehicleNumber || !source.lat || !source.lng || !destination.lat || !destination.lng;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ maxWidth: '500px', width: '100%', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <form>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Serial No:</label>
            <input
              type="text"
              value={serialNo}
              onChange={(e) => setSerialNo(e.target.value)}
              placeholder="Enter serial number"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Type of Vehicle:</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}
            >
              <option value="">Select type</option>
              <option value="ambulance">Ambulance</option>
              <option value="firetruck">Firetruck</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Vehicle Number:</label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="Enter vehicle number"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Source Location:</label>
            <input
              type="text"
              value={`${source.lat ?? ''}, ${source.lng ?? ''}`}
              onChange={(e) => {
                const [lat, lng] = e.target.value.split(',').map((val) => parseFloat(val.trim()));
                setSource({ lat: isNaN(lat) ? null : lat, lng: isNaN(lng) ? null : lng });
              }}
              placeholder="(latitude), (longitude)"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Destination Location:</label>
            <input
              type="text"
              value={`${destination.lat ?? ''}, ${destination.lng ?? ''}`}
              onChange={(e) => {
                const [lat, lng] = e.target.value.split(',').map((val) => parseFloat(val.trim()));
                setDestination({ lat: isNaN(lat) ? null : lat, lng: isNaN(lng) ? null : lng });
              }}
              placeholder="(latitude), (longitude)"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}
            />
          </div>

          <LoadScript
            googleMapsApiKey="AIzaSyBkeCfidUFW47IA3FPLOcALGE1iyxQB88s"
            onLoad={() => setMapError(false)}
            onError={() => setMapError(true)}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={15}
              onClick={handleMapClick}
            >
              {location.lat && location.lng && <MarkerF position={location} />}
              {destination.lat && destination.lng && <MarkerF position={destination} />}
            </GoogleMap>
          </LoadScript>

          {mapError && <p style={{ color: 'red', textAlign: 'center' }}>Failed to load map. Please check your Google Maps API key.</p>}

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <button
              type="button"
              onClick={handleStart}
              disabled={isStartDisabled || loading}
              style={{
                padding: '10px 20px',
                backgroundColor: isStartDisabled || loading ? '#ccc' : '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: isStartDisabled || loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                transition: 'background-color 0.3s ease',
                ...(isStartDisabled || loading ? {} : { ':hover': { backgroundColor: '#0056b3' } }),
              }}
            >
              {loading ? 'Processing...' : 'Start'}
            </button>
          </div>

          {errorMessage && <p style={{ color: 'red', marginTop: '15px', textAlign: 'center' }}>{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;
