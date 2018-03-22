import React from 'react';
import ReactDOM from 'react-dom';
import App from './components';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Enzyme, { shallow } from 'enzyme' 
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({adapter: new Adapter()})

it('renders without crashing', () => {
  const div = shallow (
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  );
});
