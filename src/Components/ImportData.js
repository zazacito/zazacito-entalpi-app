import React, { Fragment, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Slide from '@mui/material/Slide';

import Grid from '@mui/material/Grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import Loading from './Loading';

//firebase
import { db } from '../firebase';
import { writeBatch, collection, addDoc, doc, getDoc, updateDoc, Timestamp, setDoc, query, where, getDocs } from "firebase/firestore";


import CSVReader from "react-csv-reader";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const ImportData = () => {
  const [open, setOpen] = useState(false);
  const [dataset, setDataset] = useState([]);
  const [athleteName, setAthleteName] = useState("");
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);


  // snackbar
  const vertical = "top";
  const horizontal = "right";
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [messageSnackBar, setMessageSnackbar] = React.useState("");
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  };

  const randomId = (length) => {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }
    return result;
  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSaveCSV = (data, fileInfo) => {
    console.log(data, fileInfo);
    setDataset(data);
  };

  const handleSave = async () => {
    console.log("date =>", date)
    setLoading(true);
    let parameters = Object.keys(dataset[0]);
    let dataSetId = randomId(17);

    let index = 1;
    const batch = writeBatch(db);
    var size = 4000;
    var arrayOfArrays = [];
    for (var i = 0; i < dataset.length; i += size) {
      arrayOfArrays.push(dataset.slice(i, i + size));
      let arraySpliced = dataset.slice(i, i + size);
      const body = {
        datasetId: dataSetId,
        athleteName: athleteName,
        eventName: eventName,
        order: index,
        date: Timestamp.fromDate(date.$d),
        length: arraySpliced.length,
        dataset: arraySpliced,
        parameters: parameters
      }
      const docRef = doc(db, "datasets", randomId(17));
      batch.set(docRef, body);
      console.log(index, body, arraySpliced.length);
      index++;
    }

    await batch.commit();

    setMessageSnackbar("Dataset Successfully Imported. Reloading...")
    setOpenSnackbar(true);
    setLoading(false)
    setOpen(false)
    window.location.reload();
    // console.log("body =>", body)
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Button variant="contained" color="secondary" onClick={handleClickOpen}> Import Data From CSV</Button>
      <Dialog
        open={open}
        fullWidth
        maxWidth="lg"
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Import Raw Data From A CSV File
        </DialogTitle>
        <DialogContent>
          {loading === false && (
            <form>
              {/* <input type={"file"} accept={".csv"} /> */}
              <br />
              <Grid container spacing={2} style={{ textAlign: "center" }}>

                <Grid item sm={4}>
                  <TextField id="outlined-basic"
                    label="Name Of the Athlete"
                    variant="filled"
                    color="secondary"
                    fullWidth
                    value={athleteName}
                    onChange={(e) => setAthleteName(e.target.value)}
                  />
                </Grid>
                <Grid item sm={4}>
                  <TextField id="outlined-basic"
                    label="Event"
                    variant="filled"
                    color="secondary"
                    fullWidth
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}

                  />
                </Grid>
                <Grid item sm={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date of the Event"
                      value={date}
                      onChange={(newValue) => {
                        setDate(newValue);
                      }}
                      renderInput={(params) => <TextField
                        variant="filled"
                        fullWidth
                        color="secondary"{
                        ...params} />}
                    />
                  </LocalizationProvider>

                </Grid>
                <br />
                <Grid item sm={12}>
                  <CSVReader
                    cssClass="react-csv-input"
                    label="Import Your Dataset"
                    onFileLoaded={handleSaveCSV}
                    parserOptions={papaparseOptions}
                    id="dataInput"
                  />
                  <br />

                  <br />
                  {dataset.length > 0 && (
                    <Fragment>
                      Visualise Your Dataset to Validate It: ({Object.keys(dataset[0]).length} columns & {dataset.length} rows)
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              {Object.keys(dataset[0]).map((key) => {
                                return (
                                  <TableCell align="center" style={{ backgroundColor: "#b93229", color: "white" }}>{key}</TableCell>
                                )
                              }
                              )}
                            </TableRow>

                          </TableHead>
                          <TableBody>
                            {dataset.slice(0, 5).map((row) => {
                              let keys = Object.keys(row)
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
                    </Fragment>

                  )}
                </Grid>

                <br />

              </Grid >



            </form>
          )}{
            loading === true
            && (
              <Loading />
            )}



        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="secondary">
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            variant="contained"
            color="error"
            disabled={!(date !== "" && athleteName !== "" && eventName !== "" && dataset.length > 0)}>
            Save In DB
          </Button>


        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          {messageSnackBar}
        </Alert>
      </Snackbar>
    </Fragment>
  );
}

export default ImportData;
