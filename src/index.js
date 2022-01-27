import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { ContextWrapper } from "./context/ContextWrapper";
import "./styles/App.css";
import "./styles/index.css";

ReactDOM.render(
  <React.StrictMode>
    <ContextWrapper>
      <App />
    </ContextWrapper>
  </React.StrictMode>,
  document.getElementById("root")
);
