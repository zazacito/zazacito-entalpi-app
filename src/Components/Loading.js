import React, { Component, useEffect, Fragment } from 'react'

//Mui 
import Grid from '@mui/material/Grid';

const Loading = () => {

  return (
    <Fragment>
      <Grid container>
        <Grid item sm={12} class="flex-container" >

          <div class="loader-1">
            <div class="loader-2"></div>
            <div class="loader-3"></div>
            <div class="loader-4"></div>
          </div>
          <p class="help-message">Loading...</p>
        </Grid>
      </Grid>


    </Fragment >
  )
}


export default Loading

