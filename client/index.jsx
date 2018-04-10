import React from 'react';
import { render } from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
/* eslint-disable sort-imports */
import Stock from './components/Stock.jsx';
import './assets/main.scss';

const App = () => (
  <MuiThemeProvider>
    <Stock />
  </MuiThemeProvider>
);

render(<App/>, document.getElementById('stock'));
