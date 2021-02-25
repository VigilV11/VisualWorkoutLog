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
