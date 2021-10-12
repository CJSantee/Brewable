import { DefaultTheme } from '@react-navigation/native';

const LightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#a00',
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
        primary: 'rgb(0,122,137)',
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