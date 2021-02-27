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
import WorkoutData from './WorkoutData';

//++++++++++++++++  REQUIRED API KEYS ++++++++++++++++\\
// LOCATIONIQ_API_KEY in constants.js from https://locationiq.com/ for reverse geocoding
// MAPBOX_API_KEY in constants.js from https://www.mapbox.com/ for displaying the map

//++++++++++++++++  GLOBAL VARIABLES ++++++++++++++++\\
let marker;
let myMap;
let mapClickLat;
let mapClickLng;
let allWorkouts = [];

//++++++++++++++++ SELECTING DOM NODES ++++++++++++++++\\
const workoutForm = document.querySelector('.workout-form-outbox');
const submitWorkoutForm = document.querySelector('form');

const workoutType = document.querySelector('.form-type');
const workoutDistance = document.querySelector('.form-distance');
const workoutDuration = document.querySelector('.form-duration');
const workoutCadence = document.querySelector('.form-cadence');

const labelCadence = document.querySelector('.label-cadence');

workoutType.value = 'running';
workoutDistance.value = 2;
workoutDuration.value = 10;
workoutCadence.value = 60;

//++++++++++++++++ LOAD FROM LOCAL STORAGE ++++++++++++++++\\
if (localStorage.allWorkouts) {
  allWorkouts = JSON.parse(localStorage.getItem('allWorkouts'));

  allWorkouts.forEach(task => {
    console.log(task);
  });
}

//++++++++++++++++ ADD EVENT LISTENERS ++++++++++++++++\\
// Event listener to monitor form submission (Enter key)
submitWorkoutForm.addEventListener('submit', e => {
  e.preventDefault();

  // Set values in development

  // If a number is not entered in the input fields the code will issue an alert and not proceed
  if (
    !Number.isFinite(+workoutDistance.value) ||
    workoutDistance.value === '' ||
    !Number.isFinite(+workoutDuration.value) ||
    workoutDuration.value === '' ||
    !Number.isFinite(+workoutCadence.value) ||
    workoutCadence.value === ''
  ) {
    alert('Enter a numeric value!');
    return;
  }

  const workoutData = new WorkoutData(
    workoutType.value,
    workoutDistance.value,
    workoutDuration.value,
    workoutCadence.value
  );
  console.log(workoutData);

  // Set form to default values:
  workoutType.value = 'running';
  workoutDistance.value = '';
  workoutDuration.value = '';
  workoutCadence.value = '';

  // Save workout data
  allWorkouts.push(workoutData);
  localStorage.setItem('allWorkouts', JSON.stringify(allWorkouts));

  // Hide workout form slowly
  setTimeout(() => workoutForm.classList.add('hidden'), 200);

  // After the form data is entered display the tooltip
  marker = L.marker([mapClickLat, mapClickLng]).addTo(myMap); // Add marker to map

  // Customize tool tip
  const popupOptions = {
    maxWidth: 250,
    minWidth: 100,
    autoClose: false,
    closeOnClick: false,
    className:
      workoutData.type === 'running' ? 'running-popup' : 'cycling-popup',
  };

  marker
    .bindPopup(L.popup(popupOptions))
    .setPopupContent(
      `<strong>${
        workoutData.type === 'running' ? '🏃‍♂️ Running' : '🚴‍♂️ Cycling'
      }</strong> <br /> ${workoutData.distance} km, ${
        workoutData.duration
      } mins, ${workoutData.cadence} steps/min`
    )
    .openPopup();
});

// Event listener to change field values for running and cycling
workoutType.addEventListener('change', e => {
  if (e.target.value === 'cycling') {
    labelCadence.innerHTML = 'Elevation &nbsp;';
    workoutCadence.attributes.placeholder.value = 'm/min';
  } else {
    labelCadence.innerHTML = 'Cadence &nbsp;&nbsp;&nbsp;';
    workoutCadence.attributes.placeholder.value = 'step/min';
  }
});

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
  myMap = await loadMap();
  myMap.on('click', onMapClick); // Add click event listener to map
};

async function onMapClick(e) {
  ({
    latlng: { lat: mapClickLat, lng: mapClickLng },
  } = e);
  // const location = await getLocationData(lat, lng); // Get location data by reverse geocoding
  // let [mainAddress, ...remainingAddress] = location.split(','); // Display first part of address as heading (in bold)

  // Show workout form
  workoutForm.classList.remove('hidden');
}

main();
