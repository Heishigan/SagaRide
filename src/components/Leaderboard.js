// src/components/Leaderboard.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import Navbar from "./Navbar";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("totalDistance", "desc"), limit(10));
      const querySnapshot = await getDocs(q);

      const leaderboardData = [];
      querySnapshot.forEach((doc) => {
        leaderboardData.push({ id: doc.id, ...doc.data() });
      });
      setLeaderboard(leaderboardData);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <table>
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Rank</th>
                <th className="text-left py-2">User</th>
                <th className="text-right py-2">Total Distance (km)</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr key={user.id} className="border-b">
                  <td className="py-2">{index + 1}</td>
                  <td className="py-2">{user.username || "Anonymous"}</td>
                  <td className="text-right py-2">{user.totalDistance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 p-6 bg-blue-50 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            🎉 Exciting News! 🎉
          </h2>
          <p className="text-gray-700">
            The top 3 riders on the leaderboard will receive a special coupon for their next purchase at{" "}
            <span className="font-semibold text-blue-800">KuiperBelt Accessory</span>!
          </p>
          <p className="text-gray-600 mt-2">
            Keep riding and stay tuned for more offers!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;