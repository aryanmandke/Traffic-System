import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleVehicleRegistrationClick = () => {
    navigate('/vehicle-form');
  };

  const handleTrafficClick = () => {
    navigate('/traffic-control-management');
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap', // Makes it responsive, items wrap to the next line on smaller screens
    minHeight: '100vh', // Centers vertically
    padding: '20px',
    gap: '20px', // Adds space between the boxes
  };

  const boxStyle = {
    flex: '1 1 300px', // Flex-grow and shrink, with a min-width of 300px for responsiveness
    maxWidth: '400px', // Limits max width
    margin: '10px',
    padding: '20px',
    backgroundColor: '#f1f1f1',
    textAlign: 'center',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <span>For</span>
        <p>Emergency Vehicle</p>
        <button style={buttonStyle} onClick={handleVehicleRegistrationClick}>Click</button>
      </div>
      <div style={boxStyle}>
        <span>For</span>
        <p>Traffic Control Department</p>
        <button style={buttonStyle} onClick={handleTrafficClick}>Click</button>
      </div>
    </div>
  );
};

export default Home;
