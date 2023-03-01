export function getDurationString(duration) {
  let durationString = new Date(duration * 1000).toISOString().slice(14, 19);

  if (duration > 3600) {
    durationString = new Date(duration * 1000).toISOString().slice(11, 19);
  }

  return durationString
}