import React from "react";
import ReactDOM from "react-dom";
import { LoadContext } from "./components";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";
import { MuiThemeProvider, getMuiTheme } from "material-ui/styles"
import { AuthProvider } from "fireview";
import { firebaseAuth } from "./config";
import { StripeProvider } from "react-stripe-elements";
const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#0a2009',
    accent1Color: '#7CB342'
  }
});


ReactDOM.render(
  <AuthProvider auth={firebaseAuth()}>
    <StripeProvider apiKey="pk_test_IOdUH1bXLHYRTBMZtPQvFxLB">
      <MuiThemeProvider muiTheme={muiTheme}>
        <LoadContext />
      </MuiThemeProvider>
    </StripeProvider>
  </AuthProvider>,
  document.getElementById("root")
);
registerServiceWorker();
