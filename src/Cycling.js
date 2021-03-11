import Workout from './Workout';

class Cycling extends Workout {
  constructor(
    id,
    distance,
    duration,
    dateTime,
    location = null,
    coords,
    type,
    elevation
  ) {
    super(id, distance, duration, dateTime, location, coords);
    this.type = type;
    this.elevation = elevation;
  }
}

export default Cycling;
