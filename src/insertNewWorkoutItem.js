export function insertNewWorkoutItem(workoutData) {
  const allWorkoutsList = document.querySelector('.all-workouts-list');

  const html = `
  <div class="workout-item-outbox">
  <div class="workout-item-inbox">
    <h4>${workoutData.type === 'running' ? '🏃‍♂️ Running' : '🚴‍♂️ Cycling'}</h4>
    <p class="workout-info">${
      workoutData.type === 'running' ? 'Ran' : 'Cycled'
    } ${workoutData.distance} kms for ${workoutData.duration} mins at ${
    workoutData.cadenceOrElevation
  } ${workoutData.type === 'running' ? 'steps/min' : 'm/min'}</p>
    <p class="date-place">On: ${workoutData.dateTime}</p>
    
    <p class='date-place'>At: ${
      workoutData.location ? workoutData.location : 'Not specified'
    } </p>

  </div>
  </div>
  `;

  allWorkoutsList.insertAdjacentHTML('afterbegin', html);
}
