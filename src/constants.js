import * as ENV_VARS from '../env.js';

export const mapAPIMapbox = `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${ENV_VARS.MAPBOX_API_KEY}`;

export const mapAttributionMapbox = {
  attribution:
    'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'your.mapbox.access.token',
};

export const mapAPIOpenStreetMap =
  'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';

export const mapAttributionOpenStreetMap = {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

export const locationDataAPI = `https://us1.locationiq.com/v1/reverse.php?key=${ENV_VARS.LOCATIONIQ_API_KEY}&format=json`;

export const HTML_WORKOUT_FORM = `        
<div class="workout-form-outbox">
<div class="workout-form-inbox">
  <form action="">
    <div class="workout-form-line">
      <label for="type"
        >Type &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label
      >
      <select class="form-type" name="type" id="type">
        <option value="running" selected>Running</option>
        <option value="cycling">Cycling</option></select
      >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

      <label for="distance">Distance &nbsp;&nbsp;&nbsp;</label>
      <input
        class="form-distance"
        type="text"
        name="distance"
        id="distance"
        placeholder="km"
      />
    </div>

    <div class="workout-form-line">
      <label for="duration">Duration &nbsp;&nbsp;</label>
      <input
        class="form-duration"
        type="text"
        name="duration"
        id="duration"
        placeholder="min"
      />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

      <label class="label-cadence" for="cadence"
        >Cadence &nbsp;&nbsp;&nbsp;</label
      >
      <input
        class="form-cadence"
        type="text"
        name="cadence"
        id="cadence"
        placeholder="step/min"
      />
    </div>
    <div class="form-buttons">
      <button class="submit-button" type="submit">Submit</button>
      <button class="cancel-button" type="button">Cancel</button>
    </div>
  </form>
</div>
</div>`;

export const HTML_WORKOUT_ITEM = `        
<div class="workout-form-outbox">
<div class="workout-form-inbox">
  <form action="">
    <div class="workout-form-line">
      <label for="type"
        >Type &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label
      >
      <select class="form-type" name="type" id="type">
        <option value="running" selected>Running</option>
        <option value="cycling">Cycling</option></select
      >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

      <label for="distance">Distance &nbsp;&nbsp;&nbsp;</label>
      <input
        class="form-distance"
        type="text"
        name="distance"
        id="distance"
        placeholder="km"
      />
    </div>

    <div class="workout-form-line">
      <label for="duration">Duration &nbsp;&nbsp;</label>
      <input
        class="form-duration"
        type="text"
        name="duration"
        id="duration"
        placeholder="min"
      />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

      <label class="label-cadence" for="cadence"
        >Cadence &nbsp;&nbsp;&nbsp;</label
      >
      <input
        class="form-cadence"
        type="text"
        name="cadence"
        id="cadence"
        placeholder="step/min"
      />
    </div>
    <div class="form-buttons">
      <button class="submit-button" type="submit">Submit</button>
      <button class="cancel-button" type="button">Cancel</button>
    </div>
  </form>
</div>
</div>`;
