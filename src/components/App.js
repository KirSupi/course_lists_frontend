import React, { Component } from "react";
import "./App.scss";
import Panel from "./Panel/Panel";
import {Toaster} from "react-hot-toast";

class App extends Component {
    render() {
        return <>
            <Toaster/>
            <Panel/>
        </>;
    }
}

export default App;