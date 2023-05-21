import axios from "axios";
import {
  citiesList,
  currentByCity,
  weatherForDiagram,
} from "../includes/chartWeather";

const API_KEY = "";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function searchCities(query) {
  try {
    // const response = await axios.get(`${BASE_URL}/find`, {
    //   params: {
    //     q: query,
    //     type: "like",
    //     sort: "population",
    //     cnt: 10,
    //     appid: API_KEY,
    //   },
    // });

    // return response.data.list;
    return citiesList.list;
  } catch (error) {
    console.log(`Failed to fetch cities ${error.message}`);
  }
}

export async function fetchCurrentWeather(cityName, countryCode) {
  try {
    // const response = await axios.get(
    //   `${BASE_URL}/weather?q=${cityName},${countryCode}&units=metric&appid=${API_KEY}`
    // );
    // console.log("fetchCurrentWeather", response.data);
    // return response.data;
    return currentByCity;
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
  }
}

export async function fetchByCityCountry(cityName, countryCode) {
  try {
    // const response = await axios.get(
    //   `${BASE_URL}/forecast?q=${cityName},${countryCode}&units=metric&appid=${API_KEY}`
    // );
    // console.log("fetchByCityCountry", response.data);
    // return response.data.list;
    return weatherForDiagram.list;
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
  }
}
