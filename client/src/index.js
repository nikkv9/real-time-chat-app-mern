import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ContextProvider } from "./context/ContextProvider";

ReactDOM.render(
  <BrowserRouter>
    <ContextProvider>
      {/* <React.StrictMode> */}
      <App />
      {/* </React.StrictMode> */}
    </ContextProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
