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
  this.time = getDate(new Date(time * 1000));
}

let error = {
  // this.status = status,
  status: '500',
  responseText: 'Sorry, something went wrong'
}
const newData = [];
app.get('/location', (request, response) => {
  const geoData = require('./data/geo.json');
  const geoDataResult = geoData.results[0];
  const geoDataGeometry = geoDataResult.geometry;
  const geoDataLocation = geoDataGeometry.location;
  newData.push(new Geolocation(geoDataLocation.lat, geoDataLocation.lng, geoDataResult.formatted_address, geoDataResult.address_components[0].short_name.toLowerCase()));
  console.log('newData.search_query :', newData[0].search_query);
  console.log('request.query.data :', request.query.data);
  if (request.query.data === newData[0].search_query) {
    response.send(newData[0]);
  } else {
    response.send(error.responseText);
  }
})

app.get('/weather', (request, response) => {
  const weatherData = require('./data/darksky.json');
  const dailyWeatherData = weatherData.daily;
  const dailyData = dailyWeatherData.data;
  const weatherArr = [];
  dailyData.forEach(val => {
    weatherArr.push(new Forcast(val.summary, val.time));
  })

  if (request.query.data === newData.search_query) {
    response.send(weatherArr);
  } else {
    response.send(error.responseText);
  }
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
