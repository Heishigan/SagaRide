import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import Navbar from "./Navbar";
import icon from "../assets/gamlastan.png"; // Add your logo image here


const Achievements = () => {
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalCarbonSaved, setTotalCarbonSaved] = useState(0);
  const [totalCaloriesBurnt, setTotalCaloriesBurnt] = useState(0);
  const [discoveredStories, setDiscoveredStories] = useState([]);
  const [weatherAchievements, setWeatherAchievements] = useState([]);

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

        // Fetch weather achievements
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        setWeatherAchievements(userDoc.data()?.weatherAchievements || []);
      }
    };

    fetchData();
  }, []);

  // Distance Achievements
  const distanceAchievements = [
    {
      id: "10km",
      name: "Novice",
      subtext: "Have done 10 km",
      icon: "/images/10.png",
      completed: totalDistance >= 10,
    },
    {
      id: "50km",
      name: "Explorer",
      subtext: "Have done 50 km",
      icon: "/images/50.png",
      completed: totalDistance >= 50,
    },
    {
      id: "100km",
      name: "Champion",
      subtext: "Have done 100 km",
      icon: "/images/100.png",
      completed: totalDistance >= 100,
    },
  ];

  // Carbon Emission Achievements
  const carbonAchievements = [
    {
      id: "5kg",
      name: "Eco Starter",
      subtext: "Saved 5 kg CO2",
      icon: "/images/5kg.png",
      completed: totalCarbonSaved >= 5,
    },
    {
      id: "20kg",
      name: "Eco Hero",
      subtext: "Saved 20 kg CO2",
      icon: "/images/20kg.png",
      completed: totalCarbonSaved >= 20,
    },
    {
      id: "50kg",
      name: "Eco Champion",
      subtext: "Saved 50 kg CO2",
      icon: "/images/50kg.png",
      completed: totalCarbonSaved >= 50,
    },
  ];

  // Calories Burnt Achievements
  const caloriesAchievements = [
    {
      id: "500kcal",
      name: "Fitness Beginner",
      subtext: "Burnt 500 kcal",
      icon: "/images/500.png",
      completed: totalCaloriesBurnt >= 500,
    },
    {
      id: "2000kcal",
      name: "Fitness Enthusiast",
      subtext: "Burnt 2000 kcal",
      icon: "/images/2000.png",
      completed: totalCaloriesBurnt >= 2000,
    },
    {
      id: "5000kcal",
      name: "Fitness Pro",
      subtext: "Burnt 5000 kcal",
      icon: "/images/5000.png",
      completed: totalCaloriesBurnt >= 5000,
    },
  ];

  // Weather Achievements
  const weatherAchievementList = [
    {
      id: "frost-knight",
      name: "Frost Knight",
      subtext: "Cycled in <5°C weather",
      icon: "/images/snowflake.png",
      completed: weatherAchievements.includes("Frost Knight"),
    },
    {
      id: "rain-rider",
      name: "Rain Rider",
      subtext: "Cycled in the rain",
      icon: "/images/rain.png",
      completed: weatherAchievements.includes("Rain Rider"),
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Your Achievements</h1>

        {/* Distance Achievements */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Distance Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {distanceAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                name={achievement.name}
                subtext={achievement.subtext}
                icon={achievement.icon}
                completed={achievement.completed}
              />
            ))}
          </div>
        </div>

        {/* Carbon Emission Achievements */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Carbon Emission Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {carbonAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                name={achievement.name}
                subtext={achievement.subtext}
                icon={achievement.icon}
                completed={achievement.completed}
              />
            ))}
          </div>
        </div>

        {/* Calories Burnt Achievements */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Calories Burnt Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {caloriesAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                name={achievement.name}
                subtext={achievement.subtext}
                icon={achievement.icon}
                completed={achievement.completed}
              />
            ))}
          </div>
        </div>

        {/* Weather Achievements */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Weather Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {weatherAchievementList.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                name={achievement.name}
                subtext={achievement.subtext}
                icon={achievement.icon}
                completed={achievement.completed}
              />
            ))}
          </div>
        </div>

        {/* Story Stones Discovered */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Story Stones Discovered</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {discoveredStories.map((location, index) => (
              <AchievementCard
                key={index}
                name={location}
                completed={true}
                icon={icon}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AchievementCard = ({ name, subtext, icon, completed }) => {
  return (
    <div className={`p-6 rounded-lg shadow-md ${completed ? "bg-green-100" : "bg-gray-100"}`}>
      <div className="flex items-center space-x-4">
        <img src={icon} alt={name} height={48} width={48} />
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-gray-600">{subtext}</p>
          <p className="text-sm mt-2">
            {completed ? "✅ Completed" : "❌ Not Completed"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Achievements;