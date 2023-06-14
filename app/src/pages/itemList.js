import api from '../util/axios';
import { useEffect, useMemo, useState } from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { theme, Button, IconButton, Alert }   from '../theme/index';
import { useNavigate } from 'react-router-dom';


function ItemList(){
  const navigate = useNavigate();
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

  function clickHandler(id){
    navigate(`/id/${id}`);
  };
  
  

  return (
    <header className="App-header">
      <Box p="16px" display="flex" flexDirection="row" gap="8px">
        {items.map(item => {
          return (
            
              <Button colorScheme="blue" color="brand.900" onClick={() => clickHandler(item._id)} href={`item/${item.id}`} key={item.id}>{item.name}</Button>
            
            )
        })}
      </Box>
      <Box p="16px" display="flex" flexDirection="row" gap="8px">
        {items.map(item => {
          return (
            
              <IconButton variant="primary" key={item.id}>{item.link}</IconButton>
            
            )
        })}
      </Box>
      <Alert>Hello</Alert>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  );
}

export { ItemList };