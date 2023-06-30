import './App.css';
import api from './util/axios';
import { useEffect, useState, useMemo } from 'react';
import { ChakraProvider, Box, Spinner } from '@chakra-ui/react';
import { theme, Button, IconButton, Alert }   from './theme/index';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { ItemList, ItemDetails } from './pages/index';
import {Chat} from './pages/index.js';
import { GrowthBook, FeaturesReady, GrowthBookProvider } from "@growthbook/growthbook-react";

let growthbookKey = process.env.REACT_APP_GROWTHBOOK_DEV
if (process.env.REACT_APP_ENV === 'PROD') {
  growthbookKey = process.env.REACT_APP_GROWTHBOOK_PROD
}
console.log(growthbookKey)
// Create a GrowthBook instanc
const gb = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: growthbookKey,
  // Enable easier debugging during development
  enableDevMode: true,
  // Only required for A/B testing
  // Called every time a user is put into an experiment
  // trackingCallback: (experiment, result) => {
  //   console.log("Experiment Viewed", {
  //     experimentId: experiment.key,
  //     variationId: result.key,
  //   });
  // },
});

function App() {

  //Analyics
  //initialize
  useEffect(() => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('userId', userId);
    }
    window.analytics.identify(userId);
    window.analytics.track('App Loaded');
  }, []);

  //Growthbook

  useEffect(() => {
    // Load features from the GrowthBook API
    gb.loadFeatures();
  }, []);
  return (
    <ChakraProvider theme={theme}>
        <GrowthBookProvider growthbook={gb}>
        <FeaturesReady timeout={500} fallback=
          {
            <div className="splash-screen">
              <Spinner/>
            </div>
          }
          onReady={() => console.log('Features are ready')}
        >
        <Router>
        <Routes>
          <Route exact path="/" element={<Chat/>} />
        </Routes>
      </Router>
      </FeaturesReady>
      </GrowthBookProvider>
      </ChakraProvider>
    );
}

export default App;
