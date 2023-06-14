import { ChakraProvider, Box, HStack, IconButton, useColorModeValue as mode } from '@chakra-ui/react'
import PropTypes from 'prop-types';
import * as React from 'react'
import { HiLocationMarker, HiPencilAlt, HiTrash } from 'react-icons/hi'
import  '../css/theme.css';
import {theme} from '../index';

export const Description = ({title, children, location, ...props}) => {
  return (
    <ChakraProvider theme={theme}>
      <Box style={{position:"relative"}} {...props}>
        <Box fontWeight="bold" maxW="xl" >
          {title}
        </Box>
        <HStack fontSize="sm" fontWeight="medium" color={mode('gray.500', 'white')} mt="1">
          <Box as={HiLocationMarker} fontSize="md" color="gray.400" />
          <span>{location}</span>
        </HStack>
        <Box mt="3" maxW="xl" color={mode('gray.600', 'gray.200')}>
          {children}
        </Box>
        <HStack
          position={{ sm: 'absolute' }}
          top={{ sm: '0' }}
          insetEnd={{ sm: '0' }}
          mt={{ base: '4', sm: '0' }}
        >
          <IconButton aria-label="Edit" icon={<HiPencilAlt />} rounded="full" size="sm" />
          <IconButton aria-label="Delete" icon={<HiTrash />} rounded="full" size="sm" />
        </HStack>
      </Box>
    </ChakraProvider>
  );
};

Description.propTypes = {

  title: PropTypes.string,

  children: PropTypes.node,

  location: PropTypes.string,

};

Description.defaultProps = {
  title: "Default Title",
  children: ["Whatever",2,3],
  location: 'bottom',
};