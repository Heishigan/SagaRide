// src/utils/Weather.js
import axios from "axios";

const API_KEY = "0b73eb9b98dd64a0d7e774055ccd15e0";

export const getWeather = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};