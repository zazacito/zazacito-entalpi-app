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
import Chip from '@mui/material/Chip';

const RawData = (props) => {
  const [datasets, setDatasets] = useState(props.datasets)

  const [datasetToDisplay, setDatasetToDisplay] = useState(datasets[0]);

  const handleChange = (event) => {
    setDatasetToDisplay(event.target.value);
  };
  const colors = [
    "blue",
    "red",
    "orange",
    "green",
    "purple",
    "brown",
    "darkblue",
    "grey",
    "darkred",
    "darkorange",
  ]

  return (
    <Fragment>
      <Grid container spacing={1} style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
        <Grid item xs={12} style={{ textAlign: "left" }}>
          <h3 class="subtitle" style={{ paddingBottom: 10 }}> All Datasets Imported</h3>
        </Grid>
        <Grid item xs={12} style={{ paddingRight: 20 }}>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeaderaria-label="simple table" size="small">
                <TableHead>
                  <TableRow>

                    <TableCell align="center" style={{ backgroundColor: "#b93229", color: "white" }}>#</TableCell>
                    <TableCell align="center" style={{ backgroundColor: "#b93229", color: "white" }}>Athlete</TableCell>
                    <TableCell align="center" style={{ backgroundColor: "#b93229", color: "white" }}>Event</TableCell>
                    <TableCell align="center" style={{ backgroundColor: "#b93229", color: "white" }}>Date</TableCell>
                    <TableCell align="center" style={{ backgroundColor: "#b93229", color: "white" }}>Number Of Rows</TableCell>
                    <TableCell align="center" style={{ backgroundColor: "#b93229", color: "white" }}>Parameters</TableCell>


                  </TableRow>

                </TableHead>
                <TableBody>
                  {datasets.map((row, index) => {
                    console.log(row)
                    return (
                      <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >

                        <TableCell component="th" scope="row" align="center">
                          {index + 1}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {row.athleteName}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {row.eventName}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {new Date(row.date.seconds * 1000).toDateString()}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {row.dataset.length}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {row.parameters.map((parameter, index) => {
                            return (<Chip style={{ backgroundColor: colors[index], color: "white", marginRight: 5, fontWeight: 900 }} label={parameter} />)
                          })}
                        </TableCell>


                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          <br />
        </Grid>
        <Grid item xs={12}>
          <ImportData />
        </Grid>
      </Grid>
      <Grid container spacing={1} style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
        <Grid item xs={12} style={{ textAlign: "left" }}>
          <h3 class="subtitle" style={{ paddingBottom: 10 }}> Visualise A single Dataset</h3>
        </Grid>
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

        <Grid item xs={12} style={{ paddingRight: 20 }}>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeaderaria-label="simple table" size="small">
                <TableHead>
                  <TableRow>
                    {datasetToDisplay.parameters.map((key) => {
                      return (
                        <TableCell align="center" style={{ backgroundColor: "#b93229", color: "white" }}>{key}</TableCell>
                      )
                    }
                    )}
                  </TableRow>

                </TableHead>
                <TableBody>
                  {datasetToDisplay.dataset.slice(0, 100).map((row) => {
                    let keys = datasetToDisplay.parameters;
                    return (
                      <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        {keys.map((key) => {
                          return (
                            <TableCell component="th" scope="row">
                              {row[key]}
                            </TableCell>)
                        })}

                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          <br />
        </Grid>

      </Grid>
    </Fragment>
  );
}

export default RawData;
