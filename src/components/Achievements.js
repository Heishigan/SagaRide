// src/components/Achievements.js
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Navbar from "./Navbar";

const Achievements = () => {
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalCarbonSaved, setTotalCarbonSaved] = useState(0);
  const [totalCaloriesBurnt, setTotalCaloriesBurnt] = useState(0);
  const [discoveredStories, setDiscoveredStories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        // Fetch rides data
        const ridesRef = collection(db, "rides");
        const ridesQuery = query(ridesRef, where("userId", "==", user.uid));
        const ridesSnapshot = await getDocs(ridesQuery);

        let distance = 0;
        ridesSnapshot.forEach((doc) => {
          const rideData = doc.data();
          distance += parseFloat(rideData.distance);
        });
        setTotalDistance(distance.toFixed(2));
        setTotalCarbonSaved((distance * 0.2).toFixed(2)); // 0.2 kg CO2 per km
        setTotalCaloriesBurnt((distance * 40).toFixed(2)); // 40 calories per km

        // Fetch discovered stories
        const storiesRef = collection(db, "stories");
        const storiesQuery = query(storiesRef, where("discoveredBy", "array-contains", user.uid));
        const storiesSnapshot = await getDocs(storiesQuery);
        const stories = storiesSnapshot.docs.map((doc) => doc.data().location);
        setDiscoveredStories(stories);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Your Achievements</h1>

        {/* Distance Achievements */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Distance Ridden</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AchievementCard
              title="10 km"
              completed={totalDistance >= 10}
            />
            <AchievementCard
              title="50 km"
              completed={totalDistance >= 50}
            />
            <AchievementCard
              title="100 km"
              completed={totalDistance >= 100}
            />
          </div>
        </div>

        {/* Carbon Emission Achievements */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Carbon Emission Saved</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AchievementCard
              title="5 kg CO2"
              completed={totalCarbonSaved >= 5}
            />
            <AchievementCard
              title="20 kg CO2"
              completed={totalCarbonSaved >= 20}
            />
            <AchievementCard
              title="50 kg CO2"
              completed={totalCarbonSaved >= 50}
            />
          </div>
        </div>

        {/* Calories Burnt Achievements */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Calories Burnt</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AchievementCard
              title="500 kcal"
              completed={totalCaloriesBurnt >= 500}
            />
            <AchievementCard
              title="2000 kcal"
              completed={totalCaloriesBurnt >= 2000}
            />
            <AchievementCard
              title="5000 kcal"
              completed={totalCaloriesBurnt >= 5000}
            />
          </div>
        </div>

        {/* Story Stones Discovered */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Story Stones Discovered</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {discoveredStories.map((location, index) => (
              <AchievementCard
                key={index}
                title={location}
                completed={true}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AchievementCard = ({ title, completed }) => {
  return (
    <div className={`p-6 rounded-lg shadow-md ${completed ? "bg-green-100" : "bg-gray-100"}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm mt-2">
        {completed ? "✅ Completed" : "❌ Not Completed"}
      </p>
    </div>
  );
};

export default Achievements;