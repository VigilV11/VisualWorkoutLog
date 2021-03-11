//--------------------------------------------------------------------------------------//
//                                                                                      //
//                               MARK: VISUAL WORKOUT LOG                               //
//                                                                                      //
//--------------------------------------------------------------------------------------//

// ---- MARK: imports; -------------------------------------------------------------------

import L, { Marker } from 'leaflet';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { nanoid } from 'nanoid';

// import {
//   classPrivateProperties,
//   classPrivateMethods,
// } from '@parcel/transformer-js';

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

import { insertNewWorkoutItem } from './insertNewWorkoutItem';
import { insertWorkoutPin } from './insertWorkoutPin.js';
import Running from './Running.js';
import Cycling from './Cycling.js';

// ---- MARK: api keys for additional functionality --------------------------------------

// LOCATIONIQ_API_KEY in constants.js from https://locationiq.com/ for reverse geocoding (to get the location information based on the clicked co-ordinates)
// MAPBOX_API_KEY in constants.js from https://www.mapbox.com/ for displaying an alternative map

// ---- MARK: select DOM nodes -----------------------------------------------------------

const allWorkoutsList = document.querySelector('.all-workouts-list');

//--------------------------------------------------------------------------------------//
//                                                                                      //
//                                MARK: MAIN CLASS - APP                                //
//                                                                                      //
//--------------------------------------------------------------------------------------//

class App {
  #allWorkouts = [];
  #map;
  #coords;
  #mainLocation;
  #marker;

  constructor() {
    this.#loadMap();

    // Attach all event listeners
    allWorkoutsList.addEventListener('change', this.#toggleElevationField);
    allWorkoutsList.addEventListener('submit', this.#newWorkout.bind(this)); // Binding the 'this' of the instance. Otherwise 'allWorkoutsList' would take the value of 'this'.
    allWorkoutsList.addEventListener('click', this.#cancelForm);
  }

  async #loadMap() {
    const res = await this.#getCurrentPosition();

    const { latitude: lat, longitude: lng } = res.coords;
    this.#coords = { lat, lng };

    this.#map = L.map('map').setView([lat, lng], 13); // second parameter is the map zoom level

    L.tileLayer(mapAPI, mapAttribution).addTo(this.#map);

    // Add click event listener to map
    this.#map.on('click', this.#showForm.bind(this));

    // Load from local storage after map is set
    this.#loadStoredData();
  }

  #loadStoredData() {
    if (localStorage.allWorkouts) {
      this.#allWorkouts = JSON.parse(localStorage.getItem('allWorkouts'));

      this.#allWorkouts.forEach((task) => {
        insertNewWorkoutItem(task);
        insertWorkoutPin(this.#map, task);
      });
    }
  }

  #getCurrentPosition() {
    return new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );
  }

  async #showForm(e) {
    const {
      latlng: { lat, lng },
    } = e;

    this.#coords = { lat, lng };

    // // Uncomment if you want location information
    // const location = await this.#reverseGeoCoding(this.#coords); // Get location data by reverse geocoding
    // this.#mainLocation = location.split(',').slice(0, 2).join(',');

    // Show workout form
    const workoutForm = document.querySelector('.workout-form-outbox');

    if (!workoutForm?.classList.contains('workout-form-outbox'))
      allWorkoutsList.insertAdjacentHTML('afterbegin', HTML_WORKOUT_FORM);

    // Set default values for test -- remove this entire block
    const workoutType = document.querySelector('.form-type');
    const workoutDistance = document.querySelector('.form-distance');
    const workoutDuration = document.querySelector('.form-duration');
    const workoutCadence = document.querySelector('.form-cadence'); // or elevation

    // Only for testing

    // workoutType.value = 'running';
    // workoutDistance.value = 2;
    // workoutDuration.value = 10;
    // workoutCadence.value = 30;

    // document.querySelector('form').submit();
  }

  #newWorkout(e) {
    // If the event was not triggered by the form element, return immediately
    if (e.target.nodeName !== 'FORM') return;

    e.preventDefault();

    const workoutType = document.querySelector('.form-type');
    const workoutDistance = document.querySelector('.form-distance');
    const workoutDuration = document.querySelector('.form-duration');
    const workoutCadence = document.querySelector('.form-cadence'); // or elevation
    const workoutForm = document.querySelector('.workout-form-outbox');

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

    let newWorkout;

    if (workoutType.value === 'running') {
      newWorkout = new Running(
        nanoid(),
        workoutDistance.value,
        workoutDuration.value,
        new Date().toLocaleString(),
        this.#mainLocation,
        this.#coords,
        'running',
        workoutCadence.value
      );
    } else {
      newWorkout = new Cycling(
        nanoid(),
        workoutDistance.value,
        workoutDuration.value,
        new Date().toLocaleString(),
        this.#mainLocation,
        this.#coords,
        'cycling',
        workoutCadence.value
      );
    }

    // Set form to default values:
    workoutType.value = 'running';
    workoutDistance.value = '';
    workoutDuration.value = '';
    workoutCadence.value = '';

    // Save workout data
    this.#allWorkouts.push(newWorkout);
    localStorage.setItem('allWorkouts', JSON.stringify(this.#allWorkouts));

    insertNewWorkoutItem(newWorkout);

    // Hide workout form
    workoutForm.remove();

    // After the form data is entered display the tooltip
    this.#marker = L.marker([this.#coords.lat, this.#coords.lng]).addTo(
      this.#map
    ); // Add marker to map

    // Customize tool tip
    const popupOptions = {
      maxWidth: 250,
      minWidth: 100,
      autoClose: false,
      closeOnClick: false,
      className:
        newWorkout.type === 'running' ? 'running-popup' : 'cycling-popup',
    };

    this.#marker
      .bindPopup(L.popup(popupOptions))
      .setPopupContent(
        `<strong>${
          newWorkout.type === 'running' ? '🏃‍♂️ Running' : '🚴‍♂️ Cycling'
        }</strong> <br /> ${newWorkout.distance} km, ${
          newWorkout.duration
        } mins, ${
          newWorkout.type === 'running'
            ? newWorkout.cadence
            : newWorkout.elevation
        } ${newWorkout.type === 'running' ? 'steps/min' : 'm/min'}`
      )
      .openPopup();
  }

  #toggleElevationField(e) {
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
  }

  #cancelForm(e) {
    // If it is not the cancel button, return immediately
    if (!e.target.classList.contains('cancel-button')) return;
    const workoutForm = document.querySelector('.workout-form-outbox');
    workoutForm.remove();
  }

  async #reverseGeoCoding({ lat, lng }) {
    const res = await fetch(`${locationDataAPI}&lat=${lat}&lon=${lng}`);
    const data = await res.json();
    return data.display_name;
  }
}

const app = new App();
