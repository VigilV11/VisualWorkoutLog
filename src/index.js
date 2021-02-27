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

import { locationDataAPI } from './constants';

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

  const { latitude: lat, longitude: lng } = res.coords;

  let mapObj = L.map('map').setView([lat, lng], 13); // second parameter is the map zoom level

  L.tileLayer(mapAPI, mapAttribution).addTo(mapObj);

  return mapObj;
};

//++++++++++++++++ GET LOCATION DATA ++++++++++++++++\\

const getLocationData = async function (lat, lng) {
  const res = await fetch(`${locationDataAPI}&lat=${lat}&lon=${lng}`);
  const data = await res.json();
  return data.display_name;
};

//++++++++++++++++ GET USER CLICK LOCATION ++++++++++++++++\\

const main = async function () {
  const myMap = await loadMap();
  myMap.on('click', onMapClick.bind(myMap)); // Add click event listener to map
};

async function onMapClick(e) {
  const myMap = this;
  const {
    latlng: { lat, lng },
  } = e;
  const location = await getLocationData(lat, lng); // Get location data by reverse geocoding
  let [mainAddress, ...remainingAddress] = location.split(','); // Display first part of address as heading (in bold)

  var marker = L.marker([lat, lng]).addTo(myMap); // Add marker to map

  // Customize popup modal
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

main();
