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

import { HTML_WORKOUT_FORM, HTML_WORKOUT_ITEM } from './constants';

import WorkoutData from './WorkoutData';
import { insertNewWorkoutItem } from './insertNewWorkoutItem';
import { insertWorkoutPin } from './insertWorkoutPin.js';

//++++++++++++++++  REQUIRED API KEYS ++++++++++++++++\\
// LOCATIONIQ_API_KEY in constants.js from https://locationiq.com/ for reverse geocoding
// MAPBOX_API_KEY in constants.js from https://www.mapbox.com/ for displaying the map

//++++++++++++++++  GLOBAL VARIABLES ++++++++++++++++\\
let marker;
let myMap;
let allWorkouts = [];
let mainLocation;
let currentLatLng;

//++++++++++++++++ SELECTING DOM NODES ++++++++++++++++\\
const allWorkoutsList = document.querySelector('.all-workouts-list');
//++++++++++++++++ LOAD FROM LOCAL STORAGE ++++++++++++++++\\

function loadStoredData() {
  if (localStorage.allWorkouts) {
    allWorkouts = JSON.parse(localStorage.getItem('allWorkouts'));

    allWorkouts.forEach((task) => {
      insertNewWorkoutItem(task);
      insertWorkoutPin(myMap, task);
    });
  }
}
//++++++++++++++++ ADD EVENT LISTENERS ++++++++++++++++\\
// Event listener to monitor form submission (Enter key)
allWorkoutsList.addEventListener('submit', (e) => {
  // If the event was not triggered by the form element, return immediately
  if (e.target.nodeName !== 'FORM') return;

  e.preventDefault();

  const workoutType = document.querySelector('.form-type');
  const workoutDistance = document.querySelector('.form-distance');
  const workoutDuration = document.querySelector('.form-duration');
  const workoutCadence = document.querySelector('.form-cadence'); // or elevation
  const workoutForm = document.querySelector('.workout-form-outbox');

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
    workoutCadence.value,
    new Date().toLocaleString(),
    mainLocation,
    currentLatLng
  );

  // Set form to default values:
  workoutType.value = 'running';
  workoutDistance.value = '';
  workoutDuration.value = '';
  workoutCadence.value = '';

  // Save workout data
  allWorkouts.push(workoutData);
  localStorage.setItem('allWorkouts', JSON.stringify(allWorkouts));

  insertNewWorkoutItem(workoutData);

  // Hide workout form slowly
  // setTimeout(() => workoutForm.classList.add('hidden'), 200);

  workoutForm.remove();

  // After the form data is entered display the tooltip
  marker = L.marker([currentLatLng.lat, currentLatLng.lng]).addTo(myMap); // Add marker to map

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
      } mins, ${workoutData.cadenceOrElevation} steps/min`
    )
    .openPopup();
});

// Event listener to change field values for running and cycling
// workoutType.addEventListener('change', (e) => {
allWorkoutsList.addEventListener('change', (e) => {
  // If its not form type, return immediately
  if (!e.target.classList.contains('form-type')) return;

  const workoutCadence = document.querySelector('.form-cadence');
  const labelCadence = document.querySelector('.label-cadence');

  if (e.target.value === 'cycling') {
    labelCadence.innerHTML = 'Elevation &nbsp;';
    workoutCadence.attributes.placeholder.value = 'm/min';
  } else {
    labelCadence.innerHTML = 'Cadence &nbsp;&nbsp;&nbsp;';
    workoutCadence.attributes.placeholder.value = 'step/min';
  }
});

// Hide the form if cancel button is pressed
// formCancelButton.addEventListener('click', () => {
allWorkoutsList.addEventListener('click', (e) => {
  // If it is not the cancel button, return immediately
  if (!e.target.classList.contains('cancel-button')) return;
  const workoutForm = document.querySelector('.workout-form-outbox');
  workoutForm.remove();
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
  currentLatLng = { lat, lng };
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
  loadStoredData();
  myMap.on('click', onMapClick); // Add click event listener to map
};

async function onMapClick(e) {
  const {
    latlng: { lat, lng },
  } = e;

  currentLatLng = { lat, lng };

  // // Uncomment if you want location information
  // const location = await getLocationData(lat, lng); // Get location data by reverse geocoding
  // mainLocation = location.split(',').slice(0, 2).join(',');

  // Show workout form
  const workoutForm = document.querySelector('.workout-form-outbox');

  if (!workoutForm?.classList.contains('workout-form-outbox'))
    allWorkoutsList.insertAdjacentHTML('afterbegin', HTML_WORKOUT_FORM);
}

main();
