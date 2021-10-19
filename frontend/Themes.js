import { DefaultTheme } from '@react-navigation/native';

// https://coolors.co/6a7e81-4e3e30-d3c3ab-a5a8a9-cfd0d0
const LightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#894419',
        secondary: '#2C1A11',
        background: '#f0f0f0',
        card: "#f9f9f9",
        text: "#000000",
        border: "#c9d2d9",
        interactive: "rgb(0,122,255)",
        placeholder: "rgb(184,184,187)"
    }
} 

const DarkTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#894419',
        secondary: '#2C1A11',
        background: '#f0f0f0',
        card: "#f9f9f9",
        text: "#000000",
        border: "#c9d2d9",
        interactive: "rgb(0,122,255)",
        placeholder: "rgb(184,184,187)"
    }
}

export { LightTheme, DarkTheme };