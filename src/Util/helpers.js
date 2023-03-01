export function findGPSConnectionLosses(data) {
  let minDuration = 10;
  const losses = [];
  let lossStartIndex = null;
  let consecutiveLossCount = 0;

  for (let i = 1; i < data.length; i++) {
    const currentPoint = data[i];
    const previousPoint = data[i - 1];

    if (currentPoint.latitude === previousPoint.latitude && currentPoint.longitude === previousPoint.longitude) {
      consecutiveLossCount++;
      if (lossStartIndex === null) {
        lossStartIndex = i;
      }
    } else {
      if (consecutiveLossCount >= minDuration) {
        losses.push({ start: lossStartIndex, end: i - 1 });
      }
      lossStartIndex = null;
      consecutiveLossCount = 0;
    }
  }

  if (consecutiveLossCount) {
    losses.push({ start: lossStartIndex, end: data.length - 1 });
  }

  return losses;
}


export function findGPSAnomalies(data) {
  let anomalies = [];
  let pattern = [];
  let count = 0;

  let startIndex = null;
  for (let i = 0; i < data.length - 2; i++) {

    let currentPoint = data[i];
    let nextPoint = data[i + 1];
    let nextPoint2 = data[i + 2]
    if (currentPoint.longitude === nextPoint.longitude && currentPoint.latitude === nextPoint.latitude) {
      // console.log("error with connextion =>", i, i + 1, currentPoint)
      // console.log("Longitude =>", currentPoint.longitude, nextPoint.longitude)
      // console.log("latitude =>", currentPoint.latitude, nextPoint.latitude)
      if (startIndex === null) {
        startIndex = i
        // console.log("startIndex =>", startIndex)
      }
      // else {

      //   if (i - startIndex > 10) {
      //     // console.log("Actual Index =>", i - startIndex, i, { start: startIndex, end: i })
      //     anomalies.push({ start: startIndex, end: i });
      //     startIndex = null;
      //   }
      // }
    }
    if (startIndex !== null) {
      let beforePoint2 = data[i - 2]
      let beforePoint = data[i - 1];

      if ((nextPoint2.longitude === nextPoint.longitude && nextPoint2.latitude === nextPoint.latitude)
        || (currentPoint.longitude === nextPoint.longitude && currentPoint.latitude === nextPoint.latitude)
        || (currentPoint.longitude === beforePoint.longitude && currentPoint.latitude === beforePoint.latitude)
        || (currentPoint.longitude === beforePoint2.longitude && currentPoint.latitude === beforePoint2.latitude)
        || (beforePoint.longitude === beforePoint2.longitude && beforePoint.latitude === beforePoint2.latitude)) {
      } else {

        anomalies.push({ start: startIndex, end: i + 1 });
        startIndex = null;
      }
    }
  }

  return anomalies;
}


