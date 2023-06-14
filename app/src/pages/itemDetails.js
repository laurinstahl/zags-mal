import api from '../util/axios';
import { useEffect, useState } from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { theme, Button, IconButton, Alert }   from '../theme/index';
import { useParams } from 'react-router-dom';


function ItemDetails(){
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    api.get(`/api/items/${id}`)
    .then(response => {
      setItem(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  }, [id]);
  console.log(item);
  return (
      <header display="flex" className="App-header">
        {item?.name}
      <div>
        <p>
        {item?.link}
        </p>
      </div>
      <div>
        <p>
        {item?.description}
        </p>
      </div>
    </header>
  );
}

export {ItemDetails};
