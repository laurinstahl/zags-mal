import './App.css';
import api from './util/axios';
import { useEffect, useState } from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { theme, Button, IconButton, Alert }   from './theme/index';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { ItemList, ItemDetails } from './pages/index';
import {ItemDetails, ItemList} from './pages/index.js';

function App() {

  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/api/items')
    .then(response => {
      setItems(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  }, []);

  return (
    <ChakraProvider theme={theme}>
        <Router>
        <Routes>
          <Route exact path="/" element={<ItemList/>} />
          <Route exact path="/id/:id" element={<ItemDetails/>} />
        </Routes>
      </Router>
      </ChakraProvider>
    );
}

export default App;
