import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import TestComponent from "./components/TestComponent";
import { ContextWrapper } from "./context/ContextWrapper";
import "./styles/App.css";
import "./styles/index.css";
import "./styles/Fonts.css";
import "./styles/Menu.css";

ReactDOM.render(
  <React.StrictMode>
    <ContextWrapper>
      <App />
    </ContextWrapper>
  </React.StrictMode>,
  document.getElementById("root")
);
