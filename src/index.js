import React from 'react';
import ReactDOM from 'react-dom';
import App from './components';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { AuthProvider } from 'fireview';
import { firebaseAuth } from './config/constants'

ReactDOM.render(
  <AuthProvider auth={firebaseAuth()}>
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
  </AuthProvider>,
  document.getElementById('root')
);
registerServiceWorker();
