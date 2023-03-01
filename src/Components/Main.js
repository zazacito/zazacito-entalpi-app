import React, { Fragment, useState, useEffect } from 'react';

import Loading from "./Loading.js";
import Comparison from "./Comparison.js";
import Visualise from "./Visualise.js";
import RawData from "./RawData.js";
import LandingPage from "./LandingPage.js";


import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
//firebase
import { db } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc, orderBy } from "firebase/firestore";

//util 
import { getDistanceBetweenTwoPoints } from "../Util/getDistance"
import { findGPSConnectionLosses, findGPSAnomalies } from "../Util/helpers"
import { calculateRegression, predictBasedOnRegression } from "../Util/machineLearning"

import { getDurationString } from "../Util/dates";
import { Typography } from '@mui/material';

const Main = () => {
  const [valueTabs, setValueTabs] = useState('visualise');
  const [loading, setLoading] = useState(true);
  const [datasets, setDatasets] = useState([]);
  const [noDatasets, setNoDatasets] = useState(true);


  const handleChange = (event, newValue) => {
    setValueTabs(newValue);
  };

  function findEndOfRun(arr, steadyPeriod) {
    let steadyCount = 0;
    let steadyIndex = -1;

    for (let i = 0; i < arr.length; i++) {
      const velocity = arr[i].speed;
      if (velocity === 0) {
        if (steadyIndex === -1) {
          steadyIndex = i;
        }
        steadyCount++;
      } else {
        steadyCount = 0;
        steadyIndex = -1;
      }

      if (steadyCount >= steadyPeriod) {
        return steadyIndex;
      }
    }

    return -1; // if steady period not found, return -1
  }



  function findEndOfRunStride(arr, steadyPeriod) {
    let steadyCount = 0;
    let steadyIndex = -1;

    for (let i = 0; i < arr.length; i++) {
      const velocity = arr[i].stride_length;
      if (velocity === null) {
        if (steadyIndex === -1) {
          steadyIndex = i;
        }
        steadyCount++;
      } else {
        steadyCount = 0;
        steadyIndex = -1;
      }

      if (steadyCount >= steadyPeriod) {
        return steadyIndex;
      }
    }

    return -1; // if steady period not found, return -1
  }



  const getDatasets = async (userId) => {
    let items = []
    const q = query(collection(db, "datasets"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let actualDoc = doc.data();
      if (items.filter((element) => element.datasetId === actualDoc.datasetId).length === 1) {
        let itemToUpdate = items.filter((element) => element.datasetId === actualDoc.datasetId)[0];
        itemToUpdate.dataset.push(...actualDoc.dataset);
      } else {
        items.push({ id: doc.id, name: doc.data().athleteName + " - " + doc.data().eventName, ...doc.data() })
      }
    });


    items.map((item) => {
      let totalTime = 0;
      let distance = 0;
      let averageHR = 0;
      let countHR = 0;
      let averageCadence = 0;
      let countCadence = 0;
      let averageSpeed = 0;
      let countSpeed = 0;
      let averageCoreTemperature = 0;
      let countCoreTemperature = 0;
      let averageSkinTemperature = 0;
      let countSkinTemperature = 0;
      let averageStride = 0;
      let countStride = 0;
      // console.log("End of run, speed =>", findEndOfRun(item.dataset, 50), item.dataset[findEndOfRun(item.dataset, 50) + 100])
      // console.log("End of run, speed =>", findEndOfRun(item.dataset, 200))
      // TODO -> after first iteration try and fill in the data w/ averages or machine learning



      // console.log("TEsting ML =>", calculateRegression(item.dataset, "speed", 8000))

      // console.log("Predict Speed =>", predictBasedOnRegression(item.dataset, "speed", 8000));

      // console.log("End of run, stride =>", findEndOfRunStride(item.dataset, 100))

      item.dataset = item.dataset.slice(0, findEndOfRunStride(item.dataset, 100))
      // console.log("End of run, speed =>", findEndOfRun(item.dataset, 10))



      let anomalies = findGPSAnomalies(item.dataset);
      item.anomalies = anomalies;
      item.dataset.map((datapoint, index) => {
        datapoint.predicted = false;
      })
      anomalies.map((anomaly) => {
        for (let i = anomaly.start; i < anomaly.end; i++) {
          item.dataset[i].speed = predictBasedOnRegression(item.dataset, "speed", i)
          item.dataset[i].latitude = predictBasedOnRegression(item.dataset, "latitude", i)
          item.dataset[i].longitude = predictBasedOnRegression(item.dataset, "longitude", i)
          item.dataset[i].heartrate = predictBasedOnRegression(item.dataset, "heartrate", i)
          item.dataset[i].cadence = predictBasedOnRegression(item.dataset, "cadence", i)
          item.dataset[i].stride_length = predictBasedOnRegression(item.dataset, "stride_length", i)


          item.dataset[i].predicted = true;
        }
      })
      item.dataset.map((datapoint, index) => {
        if (datapoint.speed < 0.5 || datapoint.speed === null) {

          datapoint.speed = predictBasedOnRegression(item.dataset, "speed", index)
          datapoint.latitude = predictBasedOnRegression(item.dataset, "latitude", index)
          datapoint.longitude = predictBasedOnRegression(item.dataset, "longitude", index)
          // datapoint.heartrate = predictBasedOnRegression(item.dataset, "heartrate", index)
          // datapoint.cadence = predictBasedOnRegression(item.dataset, "cadence", index)
          datapoint.predicted = true;

        }
        if (datapoint.cadence < 70 || datapoint.cadence === null) {
          datapoint.cadence = predictBasedOnRegression(item.dataset, "cadence", index)
          datapoint.predicted = true;
        }
        if (datapoint.heartrate < 100 || datapoint.heartrate === null) {
          datapoint.heartrate = predictBasedOnRegression(item.dataset, "heartrate", index)
          datapoint.predicted = true;
        }
        if (datapoint.stride_length < 0.5 || datapoint.stride_length === null) {
          datapoint.stride_length = predictBasedOnRegression(item.dataset, "stride_length", index)
          datapoint.predicted = true;
        }
      })
      item.dataset.map((datapoint, index) => {
        datapoint.speedKph = datapoint.speed * 3.6;
        datapoint.seconds = index;



        if (datapoint.predicted === false) {
          if (index > 1) {
            if (datapoint.hasOwnProperty('longitude') && datapoint.hasOwnProperty('latitude')) {

              if (datapoint.speed > 0) {
                totalTime++;
                let distBetweenTwoPoints = getDistanceBetweenTwoPoints(
                  {
                    lat: item.dataset[index - 1].latitude,
                    lon: item.dataset[index - 1].longitude,
                  },
                  {
                    lat: item.dataset[index].latitude,
                    lon: item.dataset[index].longitude,
                  });

                if (distBetweenTwoPoints > 1) {
                  if (datapoint.speed < 1) {
                    datapoint.speed = item.dataset[index - 1].speed
                  }
                  let distanceCalculatedBasedOnEstimateSpeed = (datapoint.speed * 0.0001);
                  distance += distanceCalculatedBasedOnEstimateSpeed;

                } else {
                  distance += distBetweenTwoPoints
                }

              }
            }
          }
        } else {

          let distanceCalculatedBasedOnEstimateSpeed = (datapoint.speed * 0.0001);
          distance += distanceCalculatedBasedOnEstimateSpeed;
        }
        datapoint.distance = distance;
        datapoint.distanceMeters = distance / 1000;


        if (datapoint.hasOwnProperty('heartrate')) {
          if (datapoint.heartrate > 0) {
            averageHR += datapoint.heartrate
            countHR++;
          }
        }
        if (datapoint.hasOwnProperty('cadence')) {
          if (datapoint.cadence > 0) {
            averageCadence += datapoint.cadence
            countCadence++;
          }
        }
        if (datapoint.hasOwnProperty('speed')) {
          if (datapoint.speed > 0) {
            averageSpeed += datapoint.speed
            countSpeed++;
          }
        }
        if (datapoint.hasOwnProperty('core_temperature')) {
          if (datapoint.core_temperature > 0) {
            averageCoreTemperature += datapoint.core_temperature
            countCoreTemperature++;
          }
        }
        if (datapoint.hasOwnProperty('skin_temperature')) {
          if (datapoint.skin_temperature > 0) {
            averageSkinTemperature += datapoint.skin_temperature
            countSkinTemperature++;
          }
        }
        if (datapoint.hasOwnProperty('stride_length')) {
          if (datapoint.stride_length > 0) {
            averageStride += datapoint.stride_length
            countStride++;
          }
        }
      })
      item.totalTime = getDurationString(totalTime);
      item.distance = distance
      item.averageHR = averageHR / countHR;
      item.averageCadence = averageCadence / countCadence;
      item.averageSpeed = (averageSpeed / countSpeed) * 3.6;
      item.averageCoreTemperature = averageCoreTemperature / countCoreTemperature;
      item.averageSkinTemperature = averageSkinTemperature / countSkinTemperature;
      item.averageStride = averageStride / countStride;





      item.length = item.dataset.length
    })
    setDatasets(items)
    setLoading(false)
    if (items.length > 0) {
      setNoDatasets(false)
    } else {
      setNoDatasets(true)
    }
  }
  useEffect(() => {
    getDatasets()
  }, []);
  return (
    <Fragment >
      <div style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
        <Tabs
          value={valueTabs}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
          sx={{ bgcolor: '#f5f5f5e5', marginBottom: 2 }}
        >
          <Tab value="visualise" label="Visualise Your Dataset" />
          <Tab value="comparison" label="Compare Two Datasets" disabled={true} />
          <Tab value="raw" label="Raw Data" />
          <Tab value="info" label="Information / Guide" />

        </Tabs>

      </div>
      {loading === true && (
        <Grid container>
          <Loading />
        </Grid>)}
      {loading === false && valueTabs === "visualise" && (<Visualise datasets={datasets} />)}
      {loading === false && valueTabs === "comparison" && (<Comparison datasets={datasets} />)}
      {loading === false && valueTabs === "raw" && (<RawData datasets={datasets} />)}
      {loading === false && valueTabs === "info" && (
        <LandingPage />
      )}


    </Fragment>
  );
}

export default Main;
