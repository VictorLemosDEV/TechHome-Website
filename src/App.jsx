import React from "react";
import Home from "./pages/Home.tsx";

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sensors from "./pages/Sensors.tsx";
import Configuration from "./pages/Configuration/Configuration.jsx";
import Actions from "./pages/Actions.jsx";

import Auth from "./pages/auth.jsx";

import { Helmet } from "react-helmet";

import './styles/globals.css'








function StringToBool(input) {
  if (input == '1') {
    return true;
  } else {
    return false;
  }
}

export default function App() {



  return <>

    <Helmet>

      <script src="./server.js"></script>

    </Helmet>

    <BrowserRouter>


      <Routes>



        <Route path="/" exact element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/sensors" element={<Sensors />} />
        <Route path="/configuration" element={<Configuration />} />
        <Route path="/actions" element={<Actions />} />


      </Routes>

    </BrowserRouter>

  </>
}