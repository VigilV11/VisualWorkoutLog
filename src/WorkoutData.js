class WorkoutData {
  constructor(
    type,
    distance,
    duration,
    cadenceOrElevation,
    dateTime,
    location = null,
    latlng
  ) {
    this.type = type;
    this.distance = distance;
    this.duration = duration;
    this.cadenceOrElevation = cadenceOrElevation;
    this.dateTime = dateTime;
    this.location = location;
    this.latlng = latlng;
  }
}

export default WorkoutData;
