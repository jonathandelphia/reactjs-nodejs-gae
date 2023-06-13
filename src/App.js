import "./App.css";
import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import CreateImage from "./CreateImage";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CreateImage></CreateImage>
      </header>
    </div>
  );
}

export default App;
