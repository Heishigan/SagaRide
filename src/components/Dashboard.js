import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import GoogleMaps from "./GoogleMaps";
import { db, auth } from "../firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import QRScanner from "./QRScanner";
import AchievementModal from "./AchievementModal";
import { getWeather } from "../utils/Weather";

const Dashboard = () => {
  const [isRiding, setIsRiding] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [distance, setDistance] = useState(0);
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [story, setStory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [achievementLocation, setAchievementLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [rideSummary, setRideSummary] = useState(null);
  const [currentCoords, setCurrentCoords] = useState(null); // Track current location
  const [isEndingRide, setIsEndingRide] = useState(false); // Prevent multiple clicks on "End Ride"

  // Watch the user's location while riding
  useEffect(() => {
    let watchId;
    if (isRiding) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentCoords({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error watching location:", error);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }

    // Cleanup the watcher when the component unmounts or the ride ends
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isRiding]);

  // Save ride data to Firestore after distance is calculated
  useEffect(() => {
    if (distance > 0 && !isRiding) {
      saveRideData(startCoords, endCoords, distance, (new Date() - startTime) / 1000 / 60);
    }
  }, [distance, isRiding]);

  const handleStartRide = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setStartCoords({ lat: latitude, lng: longitude });
          setCurrentCoords({ lat: latitude, lng: longitude }); // Set initial location
          setIsRiding(true);
          setStartTime(new Date());

          // Fetch weather data
          const weatherData = await getWeather(latitude, longitude);
          setWeather(weatherData);

          // Check for weather-based achievements
          const user = auth.currentUser;
          if (user) {
            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);

            if (weatherData?.main?.temp < 5) {
              const achievements = userDoc.data()?.weatherAchievements || [];
              if (!achievements.includes("Frost Knight")) {
                achievements.push("Frost Knight");
                await updateDoc(userRef, { weatherAchievements: achievements });
                alert("Achievement Unlocked: Frost Knight 🥶");
              }
            }
          }
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
    if (isEndingRide) return; // Prevent multiple clicks
    setIsEndingRide(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setEndCoords({ lat: latitude, lng: longitude });
          setIsRiding(false);
          const endTime = new Date();
          const duration = (endTime - startTime) / 1000 / 60; // Duration in minutes

          // Calculate distance using Google Maps API
          await calculateDistance(startCoords, { lat: latitude, lng: longitude });

          // Set ride summary
          setRideSummary({
            distance: distance.toFixed(2),
            carbonSaved: (distance * 0.2).toFixed(2), // 0.2 kg CO2 per km
            caloriesBurnt: (distance * 40).toFixed(2), // 40 calories per km
          });

          setIsEndingRide(false); // Re-enable the button
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsEndingRide(false); // Re-enable the button in case of error
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsEndingRide(false); // Re-enable the button in case of error
    }
  };

  const calculateDistance = async (start, end) => {
    const apiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your API key
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${start.lat},${start.lng}&destinations=${end.lat},${end.lng}&key=${apiKey}`;

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
          userId: user.uid,
          startCoords: start,
          endCoords: end,
          distance: distance.toFixed(2),
          duration: duration.toFixed(2),
          timestamp: new Date().toISOString(),
        };

        // Add ride data to Firestore
        const docRef = await addDoc(collection(db, "rides"), rideData);

        // Update user's total distance
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        const currentDistance = userDoc.data()?.totalDistance || 0;
        const newDistance = currentDistance + parseFloat(distance.toFixed(2));
        await updateDoc(userRef, { totalDistance: newDistance });

        console.log("Ride data saved with ID:", docRef.id);
      }
    } catch (error) {
      console.error("Error saving ride data:", error);
    }
  };

  const handleScan = async (data) => {
    console.log("Scanned QR code:", data);

    const user = auth.currentUser;
    if (user) {
      const storyRef = doc(db, "stories", data);
      const storyDoc = await getDoc(storyRef);

      if (storyDoc.exists()) {
        const storyData = storyDoc.data();

        // Update discoveredBy field
        const discoveredBy = storyData.discoveredBy || [];
        if (!discoveredBy.includes(user.uid)) {
          discoveredBy.push(user.uid);
          await updateDoc(storyRef, { discoveredBy });
        }

        // Show achievement modal
        setAchievementLocation(storyData.location);
        setIsModalOpen(true);

        // Open audio link in a new tab (if available)
        if (storyData.audioURL) {
          window.open(storyData.audioURL, "_blank");
        }
      } else {
        console.error("Story not found");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to SagaRide Stockholm!</h1>
        <p>You are now logged in. Ready to start your cycling adventure?</p>
        {!isRiding ? (
          <button onClick={handleStartRide} className="ride-button start">
            Start
          </button>
        ) : (
          <div>
            <button
              onClick={handleEndRide}
              className="ride-button end"
              disabled={isEndingRide}
            >
              {isEndingRide ? "Ending Ride..." : "End Ride"}
            </button>
            <br />
            <button onClick={() => setShowScanner(true)} className="scanstory-button">
              Scan Story Stone
            </button>
            <br />
          </div>
        )}
        {rideSummary && (
          <div className="mt-6 p-6 bg-green-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">🎉 Congratulations!</h2>
            <p>You traveled <span className="font-bold">{rideSummary.distance} km</span>.</p>
            <p>You saved <span className="font-bold">{rideSummary.carbonSaved} kg CO2</span>.</p>
            <p>You burnt <span className="font-bold">{rideSummary.caloriesBurnt} kcal</span>.</p>
          </div>
        )}
        {distance > 0 && <p>Distance: {distance.toFixed(2)} km</p>}
        {showScanner && (
          <QRScanner
            onScan={handleScan}
            onClose={() => setShowScanner(false)}
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
        {/* Pass currentCoords to GoogleMaps */}
        <GoogleMaps currentLocation={currentCoords} />
      </div>
    </div>
  );
};

export default Dashboard;