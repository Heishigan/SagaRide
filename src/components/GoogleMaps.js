// src/components/GoogleMaps.js
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 59.3293, // Stockholm coordinates
  lng: 18.0686,
};

const GoogleMaps = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAzPeW75Q2buC8SGJlmEeLw10FZdsW59wQ", // Replace with your API key
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={13}
      center={center}
    >
      <Marker position={center} />
    </GoogleMap>
  );
};

export default GoogleMaps;