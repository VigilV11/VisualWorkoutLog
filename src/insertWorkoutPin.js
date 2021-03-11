import L from 'leaflet';

export function insertWorkoutPin(myMap, workoutData) {
  // After the form data is entered display the tooltip
  const marker = L.marker([
    workoutData.coords.lat,
    workoutData.coords.lng,
  ]).addTo(myMap); // Add marker to map

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
      `<strong class="leaflet-popup-content">${
        workoutData.type === 'running' ? '🏃‍♂️ Running' : '🚴‍♂️ Cycling'
      }</strong> <br /> ${workoutData.distance} km, ${
        workoutData.duration
      } mins, ${
        workoutData.type === 'running'
          ? workoutData.cadence
          : workoutData.elevation
      } ${workoutData.type === 'running' ? 'steps/min' : 'm/min'}`
    )
    .openPopup();
}
