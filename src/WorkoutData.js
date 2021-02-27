class WorkoutData {
  constructor(
    type,
    distance,
    duration,
    cadenceOrElevation,
    dateTime,
    location = null
  ) {
    this.type = type;
    this.distance = distance;
    this.duration = duration;
    this.cadenceOrElevation = cadenceOrElevation;
    this.dateTime = dateTime;
    this.location = location;
  }
}

export default WorkoutData;
