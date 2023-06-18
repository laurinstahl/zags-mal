import './App.css';
import api from './util/axios';
import { useEffect, useState } from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { theme, Button, IconButton, Alert }   from './theme/index';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { ItemList, ItemDetails } from './pages/index';
import {Chat} from './pages/index.js';

function App() {

  return (
    <ChakraProvider theme={theme}>
        <Router>
        <Routes>
          <Route exact path="/" element={<Chat/>} />
        </Routes>
      </Router>
      </ChakraProvider>
    );
}

export default App;
