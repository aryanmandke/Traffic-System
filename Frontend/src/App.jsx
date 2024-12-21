import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import VehicleForm from './Components/Vechile_form'; // Assuming this is your vehicle form component
import Traffic from './Components/Traffic';
import DisplayDriver from './Components/DisplayDriver';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vehicle-form" element={<VehicleForm />} />
        <Route path="/traffic-control-management" element={<Traffic/>}/>
        <Route path="/display-driver" element={<DisplayDriver/>}/>
      </Routes>
    </Router>
  );
};

export default App;
