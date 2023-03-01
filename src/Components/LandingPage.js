import React from 'react';

function LandingPage() {
  return (
    <div className="container">
      <div className="title">Welcome to my node JS App!</div>
      <div className="subtitle-bis">You can import and visualise running datasets!</div>
      <br />

      <div className="functionalities">
        <div className="functionality">
          <div className="icon"><i className="fas fa-chart-line"></i></div>
          <div className="description">
            <strong>VISUALIZE YOUR DATASET</strong> tab: select the dataset you want to visualize.
          </div>
        </div>
        <div className="functionality">
          <div className="icon"><i className="fas fa-chart-area"></i></div>
          <div className="description">
            <strong>COMPARE TWO DATASET</strong> tab: still in progress.
          </div>
        </div>
        <div className="functionality">
          <div className="icon"><i className="fas fa-database"></i></div>
          <div className="description">
            <strong>RAW DATA</strong> tab: visualize the raw and meta data from the datasets already imported. And also add your own dataset.
          </div>
        </div>
      </div>
      <br />
      <hr />
      <div className="warning">
        <div>⚠️ In the case that the dataset imported contain anomalies, (missing rows, NaN's, weird latitude and longitude or missing periods), a back end algorithm will try and predict the correct values based on a quick linear regression.</div>
      </div>
      <div className="warning">
        <div>⚠️ In the case that the dataset imported contain data after the end of your race, another backend algorithm will try and find the proper end.</div>
      </div>
      <div className="footer">
        <div>Check out my {"  "}
          <a href="https://www.linkedin.com/in/victor-azalbert-910a6b172/" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i>  Linkedin profile </a>
          and <a href="https://zazacito.github.io/" target="_blank" rel="noopener noreferrer"><i className="fas fa-folder-open"></i> portfolio </a>.</div>
        <button onClick={() => window.location.href = 'mailto:victor.azalbert@yahoo.fr'}><i className="fas fa-envelope"></i> Email me</button>
      </div>
    </div>
  );
}

export default LandingPage;
