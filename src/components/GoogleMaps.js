// src/components/GoogleMaps.js
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import React, { useState, useEffect } from "react";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 59.3293, // Stockholm coordinates
  lng: 18.0686,
};

const GoogleMaps = ({ currentLocation }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [markerPosition, setMarkerPosition] = useState(defaultCenter);

  useEffect(() => {
    if (currentLocation) {
      setMarkerPosition(currentLocation);
    }
  }, [currentLocation]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} zoom={15} center={markerPosition}>
      <Marker position={markerPosition} />
    </GoogleMap>
  );
};

export default GoogleMaps;
