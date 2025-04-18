// src/theme.js
import { extendTheme } from '@chakra-ui/react';

// 1. Define custom colors, fonts, etc.
const colors = {
  // Add a custom color palette named 'brand'
  brand: {
    50: '#e6f7ff',  // Lightest shade
    100: '#b3eaff',
    200: '#80deff',
    300: '#4dd1ff',
    400: '#26c6ff',
    500: '#00baff',  // Your primary brand color
    600: '#00a6e6',
    700: '#008bcc',
    800: '#0071b3',
    900: '#005699',  // Darkest shade
  },
  // You can also override existing palettes like 'gray', 'red', etc.
  // gray: {
  //   ...defaultTheme.colors.gray, // Keep existing grays
  //   50: '#F8F8F8', // Override a specific shade
  // }
};

const fonts = {
  // Change the default fonts
  heading: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  body: `'Roboto', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  // You could add specific fonts like 'mono' here as well
};

const components = {
  // Customize specific components
  Button: {
    // Set default props for all Button components
    defaultProps: {
      colorScheme: 'brand', // Use our custom 'brand' color scheme by default
    },
    // Change base styles
    baseStyle: {
      fontWeight: 'semibold', // Make buttons slightly bolder
      borderRadius: 'md',     // Adjust border radius
    },
    // Add or modify variants
    variants: {
      // Modify the existing 'solid' variant
      solid: (props) => ({ // Use a function for prop-based styles
        bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
        color: 'white',
        _hover: {
           bg: props.colorScheme === 'brand' ? 'brand.600' : undefined,
          _disabled: { // Ensure disabled hover style is sensible
            bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
          }
        },
        _active: {
           bg: props.colorScheme === 'brand' ? 'brand.700' : undefined,
        }
      }),
      // Add a completely new variant called 'outline-brand'
      'outline-brand': {
        border: '2px solid',
        borderColor: 'brand.500',
        color: 'brand.600',
        _hover: {
          bg: 'brand.50',
        },
      },
    },
  },
  // You could add customizations for Input, Select, Card, etc. here
  // Input: { ... }
};

const styles = {
    // Apply global styles
    global: {
      'html, body': {
        // Example: Set a default background color
        // backgroundColor: 'gray.50',
      },
      a: {
        // Example: Style all links using the brand color
        color: 'brand.600',
        _hover: {
          textDecoration: 'underline',
        },
      },
    },
};

// 2. Combine overrides and extensions into a theme object
const customTheme = extendTheme({
  colors,
  fonts,
  components,
  styles,
  // You can also configure initial color mode, breakpoints, spacing, etc.
  // config: {
  //   initialColorMode: 'light',
  //   useSystemColorMode: false,
  // }
});

// 3. Export the custom theme
export default customTheme;