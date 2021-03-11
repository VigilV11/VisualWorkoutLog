import Workout from './Workout';

class Running extends Workout {
  constructor(
    id,
    distance,
    duration,
    dateTime,
    location = null,
    coords,
    type,
    cadence
  ) {
    super(id, distance, duration, dateTime, location, coords);
    this.type = type;
    this.cadence = cadence;
  }
}

export default Running;
