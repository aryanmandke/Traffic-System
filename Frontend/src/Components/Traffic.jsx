import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserCard from './userCard';
import MapView from './MapView';

const Traffic = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data from the backend
  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/get-user-data');
      if (response.status === 200 && response.data.data) {
        setUsers(response.data.data);
      } else {
        throw new Error('Unexpected server response.');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update message in the user state
  const updateMessageInState = (serialNo, updatedMessage) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.serial_no === serialNo ? { ...user, message: updatedMessage } : user
      )
    );
  };

  // Ensure locations are parsed correctly for MapView
  const parseLocations = (users) =>
    users
      .filter(
        (user) =>
          user.source &&
          user.source.lat !== undefined &&
          user.source.lng !== undefined &&
          user.destination &&
          user.destination.lat !== undefined &&
          user.destination.lng !== undefined
      )
      .map((user) => ({
        source: { lat: user.source.lat, lng: user.source.lng },
        destination: { lat: user.destination.lat, lng: user.destination.lng },
        vehicle_number: user.vehicle_number || 'Unknown Vehicle',
        serial_no: user.serial_no || 'Unknown Serial No',
      }));

  useEffect(() => {
    fetchUserData();
    const interval = setInterval(fetchUserData, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
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

  const locations = parseLocations(users);

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
              key={user.serial_no || user.vehicle_number} // Ensure uniqueness even if serial_no is missing
              user={user}
              onUpdateMessage={(updatedMessage) => updateMessageInState(user.serial_no, updatedMessage)}
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
