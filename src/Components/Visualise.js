import React, { Fragment, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ImportData from './ImportData';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Highcharts, { color } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMap from "highcharts/modules/map";
import mapDataIE from "@highcharts/map-collection/countries/ie/ie-all.geo.json";
import { roundDecimal } from '../Util/RoundDecimal';
import { getDurationString } from '../Util/dates';
import { Typography } from '@mui/material';

highchartsMap(Highcharts);
const Visualise = (props) => {
  const [datasets, setDatasets] = useState(props.datasets)

  const [datasetToDisplay, setDatasetToDisplay] = useState(datasets[0]);

  const handleChange = (event) => {
    setDatasetToDisplay(event.target.value);
  };

  const cards = [
    {
      name: "Total Time",
      unit: "hh:mm:ss",
      color: "black",
      decimalPoint: 0,
      metric: "totalTime",
      parameter: "latitude",

    },
    {
      name: "Distance",
      unit: "km",
      color: "red",
      decimalPoint: 3,
      metric: "distance",
      parameter: "latitude",


    },
    {
      name: "Average Speed",
      unit: "km/h",
      color: "green",
      decimalPoint: 2,
      metric: "averageSpeed",
      parameter: "speed",
    },
    {
      name: "Average Heart Rate",
      unit: "bpm",
      color: "orange",
      decimalPoint: 0,
      metric: "averageHR",
      parameter: "heartrate"
    },
    {
      name: "Average Cadence",
      unit: "rpm",
      color: "#6b89d3",
      decimalPoint: 2,
      metric: "averageCadence",
      parameter: "cadence"
    },
    {
      name: "Average Stride Length",
      unit: "m",
      color: "purple",
      decimalPoint: 2,
      metric: "averageStride",
      parameter: "stride_length"

    },
    {
      name: "Average Core Temperature",
      unit: "° Celsius",
      color: "blue",
      decimalPoint: 2,
      metric: "averageCoreTemperature",
      parameter: "core_temperature"

    },
    {
      name: "Average Skin Temperature",
      unit: "° Celsius",
      color: "lightBlue",
      decimalPoint: 2,
      metric: "averageSkinTemperature",
      parameter: "skin_temperature"

    },

  ]


  const renderSharedTooltipChart = (xValue, yValue, title, type, unit, color, decimalPoint, averageBool = false, height = 300,) => {
    const data = datasetToDisplay.dataset;
    let dataToDisplay = [];
    let average = 0;
    let count = 0;
    let min = 100000000;
    let max = 0;

    let plotBandsPhases = [];
    datasetToDisplay.anomalies.map((anomaly, index) => {
      let yValue = 20;
      if (index % 2 === 0) {
        yValue = 2;
      }
      plotBandsPhases.push(
        {
          from: anomaly.start,
          to: anomaly.end,
          // borderColor: color,
          // borderWidth: 1,
          color: '#F5F5F5',
          label: {
            text: 'Anomaly',
            style: {
              color: color
            },
            y: yValue
          }
        })
    })


    data.map((datapoint, index) => {
      dataToDisplay.push({
        x: datapoint[xValue],
        y: datapoint[yValue],
      })

      if (Math.abs(datapoint[yValue]) > max) {
        max = datapoint[yValue];
      }
      if (Math.abs(datapoint[yValue]) < min) {
        min = datapoint[yValue];
      }
      if (datapoint[yValue] > 0) {
        average += datapoint[yValue];
        count++
      }
    })
    average = roundDecimal(average / count, decimalPoint);
    const options = {
      chart: {
        height: height,
        marginLeft: 40, // Keep all charts left aligned
        spacingTop: 20,
        spacingBottom: 20,
        zoomType: 'x'
      },
      title: {
        text: title,
        align: 'left',
        margin: 0,
        x: 30
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: false
      },
      xAxis: {
        crosshair: true,
        plotBands: plotBandsPhases,
        title: {
          text: ""
        },
        labels: {
          formatter: function () {
            let label = getDurationString(this.value);
            return label;
          }
        }


      },

      yAxis: {
        title: {
          text: ""
        },
        min: min,
        max: max,
        plotLines: [
          {
            color: "red",
            width: 3,
            value: average,

            label: {
              text: average + " " + unit,
              style: { color: "red" },
              align: 'left',
              x: -10
            }
          },

        ],
      },



      tooltip: {
        positioner: function () {
          return {
            // right aligned
            x: this.chart.chartWidth - this.label.width,
            y: 10 // align to title
          };
        },
        borderWidth: 0,
        backgroundColor: 'none',
        formatter: function () {
          return getDurationString(this.point.x) + " - " + roundDecimal(this.point.y, decimalPoint) + " " + unit;
        },
        headerFormat: '',
        shadow: false,
        style: {
          fontSize: '18px'
        },
      },

      series: [{
        turboThreshold: 100000,
        data: dataToDisplay,
        name: title,
        type: type,
        color: color,
        marker: {
          enabled: false,
        },
        // fillOpacity: 0.3,
        tooltip: {
          valueSuffix: ' ' + unit
        }
      }]
    };

    // if () {
    // options.yAxis.plotLines = []
    // }
    if (averageBool === false) {
      options.yAxis.plotLines = []
    }

    return (
      <div style={{ width: "100%", height: height }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    )
  }


  return (
    <Fragment>
      <Grid container spacing={1} style={{ marginLeft: 10, marginRight: 10, marginTop: 10, paddingRight: 10, paddingLeft: 10 }}>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Select the dataset you want to display</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={datasetToDisplay}
              label="Select the dataset you want to display"
              onChange={handleChange}
              renderValue={(item) => item.name}
            >
              {datasets.map((option) => (
                <MenuItem key={option.value} value={option} >
                  {option.name}
                </MenuItem>
              ))}

            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={3}>
          {/* <ImportData /> */}
        </Grid>
        {datasetToDisplay &&
          <Fragment>
            <Grid container spacing={1} style={{ marginLeft: 10, marginRight: 10, marginTop: 10, paddingRight: 10, paddingLeft: 10 }}>
              {datasetToDisplay.anomalies.length > 0 &&
                <Typography variant="body2"> Our algorithms found out {datasetToDisplay.anomalies.length} periods of anomalies in your dataset.
                  We used linear regression based on a time forecasting model to replace the weird/absent or wrong values.</Typography >}
              <Grid item xs={12} style={{ textAlign: "left" }}>
                <h3 class="subtitle" style={{ paddingBottom: 10 }}> Session Overview - Averages</h3>
              </Grid>
              {cards.map((element) => {
                if (datasetToDisplay.parameters.includes(element.parameter)) {
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} style={{ textAlign: "center" }} >
                      <div
                        class="card-custom"
                        style={{ borderBottomColor: element.color }}
                      >
                        <div class="main-value" >
                          {element.metric !== "totalTime" && roundDecimal(datasetToDisplay[element.metric], element.decimalPoint)}
                          {element.metric === "totalTime" && (datasetToDisplay[element.metric])}

                        </div>
                        <div class="text-muted unit-value">
                          {/* (10 %)  */}
                          {"    "}{element.unit}
                        </div>
                        <div class="metric-name">
                          {element.name}
                        </div>
                      </div>
                    </Grid>
                  )
                }

              })}
            </Grid>
            <Grid container spacing={1} style={{ marginLeft: 10, marginRight: 10, marginTop: 10, paddingRight: 10, paddingLeft: 10 }} id='container'>
              <Grid item xs={12} style={{ textAlign: "left" }}>
                <h3 class="subtitle" style={{ paddingBottom: 10 }}> Session Overview - Charts</h3>
              </Grid>



              <Grid item xs={12}>
                {renderSharedTooltipChart("seconds", "distance", "Distance", "area", "km", "red", 2)}
              </Grid>
              <Grid item xs={12}>
                {renderSharedTooltipChart("seconds", "speedKph", "Speed", "spline", "km/h", "green", 2, true)}
              </Grid>
              <Grid item xs={12}>
                {renderSharedTooltipChart("seconds", "heartrate", "Heart Rate", "spline", "bpm", "orange", 0, true)}
              </Grid>



              <Grid item xs={12}>
                {renderSharedTooltipChart("seconds", "cadence", "Cadence", "spline", "rpm", "#6b89d3", 0, true)}
              </Grid>
              <Grid item xs={12}>
                {renderSharedTooltipChart("seconds", "stride_length", "Stride Length", "spline", "m", "purple", 2, true)}
              </Grid>
              {datasetToDisplay.parameters.includes("core_temperature") && (
                <Grid item xs={12}>
                  {renderSharedTooltipChart("seconds", "core_temperature", "Average Core Temperature", "spline", "° Celsius", "blue", 2, true)}
                </Grid>
              )}
              {datasetToDisplay.parameters.includes("skin_temperature") && (
                <Grid item xs={12}>
                  {renderSharedTooltipChart("seconds", "skin_temperature", "Average Skin Temperature", "spline", "° Celsius", "lightBlue", 2, true)}
                </Grid>
              )}




            </Grid>
            <Grid container spacing={1} style={{ marginLeft: 10, marginRight: 10, marginTop: 10, paddingRight: 10, paddingLeft: 10 }}>
              <Grid item xs={12} style={{ textAlign: "left" }}>
                <h3 class="subtitle" style={{ paddingBottom: 10 }}> Map & Coordinates</h3>
              </Grid>

              <Grid item xs={12}>
                {renderSharedTooltipChart("seconds", "latitude", "Latitude", "line", "°", "black", 3)}
                {renderSharedTooltipChart("seconds", "longitude", "Longitude", "line", "°", "black", 3)}
              </Grid>


            </Grid>
          </Fragment>}


      </Grid >
    </Fragment >
  );
}

export default Visualise;
