import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
//import "~antd/dist/antd.css";

ReactDOM.render(
    <BrowserRouter basename="/">
        <App />
    </BrowserRouter>,
    document.getElementById("root")
);
