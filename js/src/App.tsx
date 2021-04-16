import * as React from "react";
import logo from "./logo.svg";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => {console.log('test')
         chrome.runtime.sendMessage({type: "START"})}}>start</button>
      </header>
    </div>
  );
};

export default App;
