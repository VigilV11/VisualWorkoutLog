import L from 'leaflet';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
// import {
//   mapAPIMapbox as mapAPI,
//   mapAttributionMapbox as mapAttribution,
// } from './constants.js';
import {
  mapAPIOpenStreetMap as mapAPI,
  mapAttributionOpenStreetMap as mapAttribution,
} from './constants.js';

import * as ENV_VARS from '../env.js';

//++++++++++++++++  REQUIRED API KEYS ++++++++++++++++\\
// LOCATIONIQ_API_KEY from https://locationiq.com/ for reverse geocoding
// MAPBOX_API_KEY in constants.js from https://www.mapbox.com/ for displaying the map

//++++++++++++++++ PROMISIFYING GEOLOCATION API CALL ++++++++++++++++\\
const getPosition = function () {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );
};

//++++++++++++++++ DISPLAY MAP TO CURRENT POSITION ++++++++++++++++\\
const loadMap = async function () {
  const res = await getPosition();
  const lat = res.coords.latitude;
  const lng = res.coords.longitude;

  let mapObj = L.map('map').setView([lat, lng], 13); // second parameter is the map zoom level

  L.tileLayer(mapAPI, mapAttribution).addTo(mapObj);

  return mapObj;
};

//++++++++++++++++ GET LOCATION DATA ++++++++++++++++\\

const getLocationData = async function (lat, lng) {
  const res = await fetch(
    `https://us1.locationiq.com/v1/reverse.php?key=${ENV_VARS.LOCATIONIQ_API_KEY}&format=json&lat=${lat}&lon=${lng}`
  );
  const data = await res.json();
  return data.display_name;
};

//++++++++++++++++ GET USER CLICK LOCATION ++++++++++++++++\\

const getMapLocation = async function () {
  const myMap = await loadMap();
  myMap.on('click', onMapClick.bind(myMap));
};

async function onMapClick(e) {
  const myMap = this;
  const {
    latlng: { lat, lng },
  } = e;
  const location = await getLocationData(lat, lng);
  let [mainAddress, ...remainingAddress] = location.split(',');

  var marker = L.marker([lat, lng]).addTo(myMap);

  // Customize popup
  const popupOptions = {
    maxWidth: 250,
    minWidth: 100,
    autoClose: false,
    closeOnClick: false,
    className: 'running-popup',
  };

  marker
    .bindPopup(L.popup(popupOptions))
    .setPopupContent(
      `<strong>${mainAddress}</strong> <br /> ${remainingAddress.join(', ')}`
    )
    .openPopup();
}

getMapLocation();
