// function interpolateLinear(data, missingIndex) {
//   let prevIndex = missingIndex - 1;
//   let nextIndex = missingIndex + 1;
//   let prevValue = data[prevIndex].speed;
//   let nextValue = data[nextIndex].speed;
//   let missingValue = (prevValue + nextValue) / 2;
//   data[missingIndex].speed = missingValue;
// }

import regression from "regression";
export const calculateRegression = (data, metric, indexToPredict) => {
  let regressionData = [];
  regressionData = data.map((element, index) => {
    return [parseFloat(index), parseFloat(element[metric])];
  });
  const result = regression.linear(regressionData);
  const gradient = result.equation[0];
  const yIntercept = result.equation[1];
  const prediction = result.predict(indexToPredict);
  regressionData = result.points.map(el => {
    return {
      x: el[0],
      y: el[1]
    };
  });
  return { regressionData, gradient, yIntercept, prediction };
};

export const predictBasedOnRegression = (data, metric, indexToPredict) => {
  let regressionData = [];
  regressionData = data.map((element, index) => {
    return [(index), (element[metric])];
  });
  const result = regression.linear(regressionData);
  const prediction = result.predict(indexToPredict);

  return prediction[1];
};


// export function forecastTimeSeries(data, missingIndex) {
//   // Use a time series modeling library like 'forecast' or 'prophet' to predict missing value based on past data
//   let pastData = data.slice(0, missingIndex);
//   let predictedValue = predictMissingValue(pastData);
//   data[missingIndex].speed = predictedValue;
// }

// function imputeKNN(data, missingIndex, k) {
//   let neighbors = findKNearestNeighbors(data, missingIndex, k);
//   let missingValue = calculateMissingValue(neighbors);
//   data[missingIndex].speed = missingValue;
// }


// function findKNearestNeighbors(data, missingIndex, k) {
//   let distances = [];
//   // Calculate distances from the missing value to every other value
//   for (let i = 0; i < data.length; i++) {
//     if (i !== missingIndex) {
//       let dist = calculateDistance(data[i].speed, data[missingIndex].speed);
//       distances.push([dist, i]);
//     }
//   }
//   // Sort distances in ascending order
//   distances.sort(function (a, b) {
//     return a[0] - b[0];
//   });
//   // Find the k nearest neighbors
//   let nearestNeighbors = [];
//   for (let i = 0; i < k; i++) {
//     nearestNeighbors.push(data[distances[i][1]]);
//   }
//   return nearestNeighbors;
// }

// function predictMissingValue(pastData) {
//   // Convert past data to a time series object
//   let timeSeries = convertToTimeSeries(pastData);
//   // Use a time series modeling library like 'forecast' or 'prophet' to predict missing value based on past data
//   let model = trainTimeSeriesModel(timeSeries);
//   let predictedValue = model.predict();
//   return predictedValue;
// }


// function predictMissingValue(pastData) {
//   // Split past data into features and target
//   let features = [];
//   let target = [];
//   for (let i = 0; i < pastData.length; i++) {
//     if (pastData[i].speed !== null) {
//       features.push([pastData[i].elevation, pastData[i].heartrate]);
//       target.push(pastData[i].speed);
//     }
//   }
//   // Train a linear regression model on past data
//   let regression = new ML.SimpleLinearRegression(features, target);
//   // Predict the missing value using the regression model
//   let predictedValue = regression.predict([[missingElevation, missingHeartrate]]);
//   return predictedValue;
// }
