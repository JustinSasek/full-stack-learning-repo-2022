import './App.css';
import React, { useState } from "react";
import { useEffect } from "react";
// import SearchBar from "./comp/SearchBar.js";


const apiKey = "8df56f673f0e663f365888c9eb52029f";
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]


function App() {

  function onClickHander() {
    let input = document.getElementById("input-field").value;
    let apiCall = `https://api.openweathermap.org/geo/1.0/direct?q=${input},,US&limit=5&appid=${apiKey}`;
    fetch(apiCall)
      .then((response) => response.json())
      .then((data) => {
        // data = [{ name: "Austin", state: "TX" }, { name: "Austin", state: "FL" }];
        setCities(data)
      })
  }

  const [cities, setCities] = useState('');

  function Cities() {
    const output = []
    for (var i = 0; i < cities.length; i++) {
      const city = cities[i];
      const name = city.name + ", " + city.state
      output[i] = <li key={"" + city.lon + city.lat} className="city-name" onClick={() => getWeatherData(name, city.lon, city.lat)}>
        {name}
      </li>
    }
    return (
      <ul style={{ textAlign: "left" }}>{output}</ul>
    )
  }

  function getWeatherData(cityName, lon, lat) {

    let apiCall = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";
    fetch(apiCall)
      .then((response) => response.json())
      .then((data) => {
        let currentWeather = data;

        apiCall = "https://api.openweathermap.org/data/2.5/air_pollution?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
        fetch(apiCall)
          .then((response) => response.json())
          .then((data) => {
            let polution = data;

            apiCall = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";
            fetch(apiCall)
              .then((response) => response.json())
              .then((data) => {
                let forcast = []

                for (let i = 0; i < data.list.length; i++) {
                  let dayData = data.list[i];

                  let d = new Date(dayData.dt * 1000);
                  let date = months[d.getMonth()] + " " + d.getDate();

                  let min = Number.MAX_VALUE;
                  let max = Number.MIN_VALUE;

                  let img = "icons/" + dayData.weather[0].icon + ".svg";

                  for (; (ngew Date(dayData.dt * 1000)).getDate() === d.getDate() && i < data.list.length; i++) {
                    d = new Date(dayData.dt * 1000);
                    min = Math.min(min, Math.trunc(dayData.main.temp_min));
                    max = Math.max(max, Math.trunc(dayData.main.temp_max));
                    if (d.getHours() >= 11 && d.getHours() <= 13) {
                      img = "icons/" + dayData.weather[0].icon + ".svg";
                    }
                    dayData = data.list[i];
                  }
                  forcast = [...forcast, {
                    date: date,
                    img: img,
                    min: min,
                    max: max
                  }];
                }


                const d = new Date();

                setWeatherData({
                  date: months[d.getMonth()] + " " + d.getDate(),
                  cityName: cityName,
                  currentCond: currentWeather.weather[0].main,
                  curentTemp: Math.trunc(currentWeather.main.temp),
                  curentAQI: polution.list[0].main.aqi,
                  currentImg: "icons/" + currentWeather.weather[0].icon + ".svg",
                  forcast: forcast
                })
                clearSearch();
              });
          });
      });
  }

  function clearSearch() {
    document.getElementById("input-field").value = "";
    setCities([]);
  }

  const [data, setWeatherData] = useState('');

  function WeatherData() {
    console.log(data);
    if (data === '') {
      return;
    }
    let boxData = data.forcast.map((dailyData) =>
      <div className="forcast-boxes">
        <h3>{dailyData.date}</h3>
        <img src={dailyData.img} className="forcast-img"></img>
        <h3> {dailyData.min}{'\u00b0'} to {dailyData.max}{'\u00b0'}</h3>
      </div>
    )
    return (
      <div id="weather-data">
        <div id="title">
          <h3>{data.date}</h3>
          <h2>Weather for {data.cityName}</h2>
        </div>
        <div id="current">
          <div id="current-cond">
            <h3>{data.currentCond}</h3>
            <h1>{data.curentTemp}{'\u00b0'}</h1>
            <h3>AQI: {data.curentAQI}</h3>
          </div>
          <div id="current-img">
            <img src={data.currentImg}></img>
          </div>
        </div>
        <div id="forcast">
          {boxData}
        </div>
      </div>
    )
  }


  return (
    <div className="App">
      <div id="weather-section">
        <WeatherData />
      </div>
      <div id="city-section">
        <div id="search-section">
          <input id="input-field"></input>
          <button id="search-button" onClick={onClickHander}>Search</button>
        </div>
        <div><Cities /></div>

      </div>
    </div>
  );
}



export default App;
