import React from "react";
import ReactDOM from "react-dom";
import App from "./components";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { AuthProvider } from "fireview";
import { firebaseAuth } from "./config";
import { StripeProvider } from "react-stripe-elements";

ReactDOM.render(
  <AuthProvider auth={firebaseAuth()}>
    <StripeProvider apiKey="pk_test_IOdUH1bXLHYRTBMZtPQvFxLB">
      <MuiThemeProvider>
        <App />
      </MuiThemeProvider>
    </StripeProvider>
  </AuthProvider>,
  document.getElementById("root")
);
registerServiceWorker();
