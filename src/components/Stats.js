// src/components/Stats.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth } from "../firebase";
import Navbar from "./Navbar"; // Import the Navbar

const Stats = () => {
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [totalCarbonSaved, setTotalCarbonSaved] = useState(0);
  const [totalCaloriesBurnt, setTotalCaloriesBurnt] = useState(0);

  useEffect(() => {
    const fetchRides = async () => {
      const user = auth.currentUser;
      if (user) {
        const ridesRef = collection(db, "rides");
        const q = query(ridesRef, where("userId", "==", user.uid)); // Filter rides by user ID
        const querySnapshot = await getDocs(q);

        let distance = 0;
        let time = 0;

        querySnapshot.forEach((doc) => {
          const rideData = doc.data();
          distance += parseFloat(rideData.distance); // Sum distance
          time += parseFloat(rideData.duration); // Sum duration
        });

        setTotalDistance(distance.toFixed(2));
        setTotalTime(time.toFixed(2));

        // Calculate carbon saved (0.2 kg CO2 per km)
        const carbonSaved = distance * 0.2;
        setTotalCarbonSaved(carbonSaved.toFixed(2));

        // Calculate calories burnt (40 calories per km)
        const caloriesBurnt = distance * 40;
        setTotalCaloriesBurnt(caloriesBurnt.toFixed(2));
      }
    };

    fetchRides();
  }, []);

  return (
    <div>
      <Navbar /> {/* Add the Navbar */}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Your Cycling Stats</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Total Kilometers Ridden</h2>
            <p className="text-3xl mt-2">{totalDistance} km</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Total Time Spent</h2>
            <p className="text-3xl mt-2">{totalTime} minutes</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Total Carbon Emission Saved</h2>
            <p className="text-3xl mt-2">{totalCarbonSaved} kg CO2</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Total Calories Burnt</h2>
            <p className="text-3xl mt-2">{totalCaloriesBurnt} kcal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;