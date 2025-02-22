// src/components/Dashboard.js
import React, { useState } from "react";
import Navbar from "./Navbar";
import GoogleMaps from "./GoogleMaps";
import { db, auth } from "../firebase"; // Import auth
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import QRScanner from "./QRScanner";
import AchievementModal from "./AchievementModal"; // Import the modal

const Dashboard = () => {
  const [isRiding, setIsRiding] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [distance, setDistance] = useState(0);
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [story, setStory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [achievementLocation, setAchievementLocation] = useState(""); // Achievement location

  const handleStartRide = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setStartCoords({ lat: latitude, lng: longitude });
          setIsRiding(true);
          setStartTime(new Date());
          console.log("Ride started at:", new Date());
          console.log("Start coordinates:", latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleEndRide = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setEndCoords({ lat: latitude, lng: longitude });
          setIsRiding(false);
          const endTime = new Date();
          const duration = (endTime - startTime) / 1000 / 60; // Duration in minutes
          console.log("Ride ended at:", endTime);
          console.log("Duration:", duration.toFixed(2), "minutes");
          console.log("End coordinates:", latitude, longitude);

          // Calculate distance using Google Maps API
          await calculateDistance(startCoords, { lat: latitude, lng: longitude });

          // Save ride data to Firestore
          await saveRideData(startCoords, { lat: latitude, lng: longitude }, distance, duration);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const calculateDistance = async (start, end) => {
    const apiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your API key
    const url = `/api/maps/api/distancematrix/json?units=metric&origins=${start.lat},${start.lng}&destinations=${end.lat},${end.lng}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.rows[0].elements[0].status === "OK") {
        const distance = data.rows[0].elements[0].distance.value / 1000; // Distance in km
        setDistance(distance);
        console.log("Distance traveled:", distance.toFixed(2), "km");
      } else {
        console.error("Error calculating distance:", data.rows[0].elements[0].status);
      }
    } catch (error) {
      console.error("Failed to fetch distance:", error);
    }
  };

  const saveRideData = async (start, end, distance, duration) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const rideData = {
          userId: user.uid, // Add the user ID
          startCoords: start,
          endCoords: end,
          distance: distance.toFixed(2), // Distance in km
          duration: duration.toFixed(2), // Duration in minutes
          timestamp: new Date().toISOString(), // Current time in ISO format
        };
  
        // Add ride data to Firestore
        const docRef = await addDoc(collection(db, "rides"), rideData);
        console.log("Ride data saved with ID:", docRef.id);
      }
    } catch (error) {
      console.error("Error saving ride data:", error);
    }
  };

  const handleScan = async (data) => {
    console.log("Scanned QR code:", data);

    // Fetch story from Firestore
    const storyRef = doc(db, "stories", data); // Use QR code value as document ID
    const storyDoc = await getDoc(storyRef);
    

    if (storyDoc.exists()) {
      const storyData = storyDoc.data();

      // Show achievement modal
      setAchievementLocation(storyData.location);
      setIsModalOpen(true);
      console.log("Opening audio link:", storyData.audioURL);
      if (storyData.audioURL) {
        window.open(storyData.audioURL, "_blank");
      }

      // Open audio link in a new tab (if available)
      if (storyData.audioURL) {
        window.open(storyData.audioURL, "_blank");
      }
    } else {
      console.error("Story not found");
    }
    
  };

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1>Welcome to SagaRide Stockholm!</h1>
        <p>You are now logged in. Ready to start your cycling adventure?</p>
        {!isRiding ? (
          <button
            onClick={handleStartRide}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Start Ride
          </button>
        ) : (
          <div>
            <button
              onClick={handleEndRide}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              End Ride
            </button>
            <button
              onClick={() => setShowScanner(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              Scan Story Stone
            </button>
          </div>
        )}
        {distance > 0 && <p>Distance: {distance.toFixed(2)} km</p>}
        {showScanner && (
          <QRScanner
            onScan={handleScan}
            onClose={() => setShowScanner(false)} // Close the scanner
          />
        )}
        {story && (
          <div className="mt-4">
            <h2 className="text-xl font-bold">{story.title}</h2>
            <p>{story.content}</p>
          </div>
        )}
        <AchievementModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          location={achievementLocation}
        />
        <GoogleMaps />
      </div>
    </div>
  );
};

export default Dashboard;