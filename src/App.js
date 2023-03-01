import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar';
import Main from './Components/Main';

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';


function App() {
  const theme = createTheme({
    palette: {
      secondary: {
        main: '#b93229'
      },
      error: {
        main: '#ff800'
      },
    },
  });
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Navbar />
        <Main />
        <footer> Made By ZazacitoTech. Datasets belong to Entalpi.</footer>
      </ThemeProvider>
    </div >
  );
}

export default App;
