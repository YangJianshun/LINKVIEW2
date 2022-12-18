import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "mobx-react";
import "./index.css";
import store from "./store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider {...store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
