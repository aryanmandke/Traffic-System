import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

// Default coordinates for source and destination
const defaultSource = { lat: 19.022237, lng: 72.856052 }; // Mumbai
const defaultDestination = { lat: 19.036457, lng: 72.85995 }; // Pune

// Validate if coordinates are valid
const isValidCoordinates = (coords) =>
  coords && typeof coords.lat === "number" && typeof coords.lng === "number";

const MapView = ({ locations = [], onSourceChange, onDestinationChange }) => {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Load the Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey,
  });

  // State to hold the source and destination markers
  const [source, setSource] = useState(defaultSource);
  const [destination, setDestination] = useState(defaultDestination);

  // If locations are passed, update the markers
  useEffect(() => {
    if (locations.length > 0) {
      const newSource = locations[0].source;
      const newDestination = locations[0].destination;

      if (isValidCoordinates(newSource)) {
        setSource(newSource);
      }

      if (isValidCoordinates(newDestination)) {
        setDestination(newDestination);
      }
    }
  }, [locations]);

  // Handle error loading Google Maps
  if (loadError) {
    return <p>Error loading map. Please try again later.</p>;
  }

  // Loading state
  if (!isLoaded) {
    return <p>Loading map...</p>;
  }

  const center = isValidCoordinates(source) ? source : defaultSource;
  const zoom = isValidCoordinates(source) && isValidCoordinates(destination) ? 12 : 10;

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "400px" }}
      center={center}
      zoom={zoom}
    >
      {/* Marker for Source */}
      {isValidCoordinates(source) && (
        <Marker
          position={source}
          title="Source"
          onClick={() => onSourceChange && onSourceChange(source)}
        />
      )}

      {/* Marker for Destination */}
      {isValidCoordinates(destination) && (
        <Marker
          position={destination}
          title="Destination"
          onClick={() => onDestinationChange && onDestinationChange(destination)}
        />
      )}
    </GoogleMap>
  );
};

export default MapView;
