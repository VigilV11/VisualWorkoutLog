// import L from 'leaflet';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {
  mapAPIMapbox as mapAPI,
  mapAttributionMapbox as mapAttribution,
} from './constants.js';
// import {
//   mapAPIOpenStreetMap as mapAPI,
//   mapAttributionOpenStreetMap as mapAttribution,
// } from './constants.js';

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

  console.log(lat, lng);
  let mapObj = L.map('map').setView([lat, lng], 13); // second parameter is the map zoom level

  L.tileLayer(mapAPI, mapAttribution).addTo(mapObj);

  return mapObj;
};

//++++++++++++++++ GET USER CLICK LOCATION ++++++++++++++++\\

const getMapLocation = async function () {
  const myMap = await loadMap();
  myMap.on('click', onMapClick.bind(myMap));
};

function onMapClick(e) {
  console.log(e.latlng);
  console.log(this);
  const myMap = this;
  var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(myMap);
  marker.bindPopup('<b>New location</b><br>how wonderful!').openPopup();
}

getMapLocation();
