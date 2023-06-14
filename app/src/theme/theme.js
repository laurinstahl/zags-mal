import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#ffe7ff",
      100: "#ffb6e7",
      200: "#ff7fd4",
      300: "#ff4fc3",
      400: "#ff1fba",
      500: "#e600a3",
      600: "#b80084",
      700: "#8f0066",
      800: "#660049",
      900: "#3d002b",
    },
  },
  components: {
    Button: {
      variants: {
        primary: {
          bg: "green.500",
          color: "white",
        }
      }
    }
  }
});

export {theme};