'use strict';
const PORT = process.env.PORT || 3000;
const express = require('express');
const cors = require('cors');

const app = express();
require('dotenv').config();
app.use(cors());

function Geolocation(latitude, longitude, formatted_address, search_query) {
  this.latitude = latitude,
  this.longitude = longitude,
  this.formatted_query = formatted_address,
  this.search_query = search_query
}

function Forcast(forecast, time) {
  this.forecast = forecast,
  this.time = getDate(new Date(time));
}

// function serverError(err) {
//   // this.status = status,
//   res.send('Sorry, something went wrong')
// }

app.get('/location', (request, response) => {
  const geoData = require('./data/geo.json');
  const geoDataResult = geoData.results[0];
  const geoDataGeometry = geoDataResult.geometry;
  const geoDataLocation = geoDataGeometry.location;
  const newData = new Geolocation(geoDataLocation.lat, geoDataLocation.lng, geoDataResult.formatted_address, geoDataResult.address_components[0].short_name.toLowerCase());
  response.send(newData);
})

app.get('/weather', (request, response) => {
  const weatherData = require('./data/darksky.json');
  const dailyWeatherData = weatherData.daily;
  const dailyData = dailyWeatherData.data;
  // const forcastOne = new Forcast(dailyData.summary, dailyData.time);
  const weatherArr = [];
  dailyData.forEach(val => {
    weatherArr.push(new Forcast(val.summary, val.time));
  })
  console.log('weatherArr :', weatherArr);
  response.send(weatherArr);
})

function getDate(time) {
  const day = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  let currentDate = `${day[time.getDay()]} ${month[time.getMonth()]} ${time.getDate()} ${time.getFullYear()}`;
  return currentDate;
}

app.get('/', function (req, res) {
  res.send(new Error('my bad'));
})

app.listen(PORT, () => {
  console.log(`App is on PORT: ${PORT}`);
})
