import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserCard from './UserCard';
import MapView from './MapView';

const Traffic = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/get-user-data');
      setUsers(response.data.data);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateMessageInState = (serialNo, updatedMessage) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.serial_no === serialNo ? { ...user, message: updatedMessage } : user
      )
    );
  };

  useEffect(() => {
    fetchUserData();
    const interval = setInterval(fetchUserData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-pulse text-gray-500 text-lg">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div>
          <p className="text-lg font-semibold text-red-600">{error}</p>
          <button
            onClick={fetchUserData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const locations = users
    .map((user) => ({
      source: user.source?.lat && user.source?.lng ? { lat: user.source.lat, lng: user.source.lng } : null,
      destination: user.destination?.lat && user.destination?.lng ? { lat: user.destination.lat, lng: user.destination.lng } : null,
      vehicle_number: user.vehicle_number, // Ensure you're using vehicle_number
      serial_no: user.serial_no, // Using serial_no
    }))
    .filter((location) => location.source && location.destination);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Driver Information and Live Location
      </h1>
      <MapView locations={locations} />
      {users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {users.map((user) => (
            <UserCard
              key={user.serial_no} // Changed from _id to serial_no
              user={user}
              onUpdateMessage={(updatedMessage) => updateMessageInState(user.serial_no, updatedMessage)} // Changed from _id to serial_no
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No users found.</p>
      )}
    </div>
  );
};

export default Traffic;
