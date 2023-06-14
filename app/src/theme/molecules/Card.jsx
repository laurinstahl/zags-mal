import {
  ChakraProvider,
  Box,
  Button,
  Divider,
  Flex,
  Stack,
  StackDivider,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react'
import * as React from 'react'
import { HiPlus } from 'react-icons/hi'
import { Description } from '../components/Description'
import { theme } from '../index'
import PropTypes from 'prop-types';


export const Card = (props) => {
  return (
    <ChakraProvider theme={theme}>
      <Box {...props} as="section" py="12" bg={mode('gray.100', 'gray.800')}>
        <Box maxW={{ base: 'xl', md: '7xl' }} mx="auto" px={{ md: '8' }}>
          <Box
            rounded={{ lg: 'lg' }}
            bg={mode('white', 'gray.700')}
            maxW="3xl"
            mx="auto"
            shadow="base"
            overflow="hidden"
          >
            <Flex align="center" justify="space-between" px="6" py="4">
              <Text as="h3" fontWeight="bold" fontSize="lg">
                {props.title}
              </Text>
              { props.buttonText && ( <Button colorScheme="blue" onClick={props.clickFunction} minW="20" leftIcon={<HiPlus />}>
                {props.buttonText}
              </Button>)}
            </Flex>
            <Divider />
            <Stack spacing="6" py="5" px="8" divider={<StackDivider />}>
              {props.children}
            </Stack>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  )
}

Card.propTypes = {
  title: PropTypes.string,
  buttonText: PropTypes.string,
  clickFunction: PropTypes.func,
  children: PropTypes.node,
};

Card.defaultProps = {
  title: "Default Title",
};
