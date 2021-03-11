class Workout {
  constructor(id, distance, duration, dateTime, location = null, coords) {
    this.id = id;
    this.distance = distance;
    this.duration = duration;
    this.dateTime = dateTime;
    this.location = location;
    this.coords = coords;
  }
}

export default Workout;
