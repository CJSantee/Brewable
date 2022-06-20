import { DefaultTheme } from '@react-navigation/native';
import { DefaultTheme as iOSDefault } from 'react-native-ios-kit';

// https://coolors.co/6a7e81-4e3e30-d3c3ab-a5a8a9-cfd0d0
const LightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#f0f0f0',
        card: "#f9f9f9",
        header: "#f9f9f9",
        text: "#000000",
        border: "#c9d2d9",
        interactive: "rgb(0,122,255)",
        placeholder: "rgb(184,184,187)",
        destructive: "rgb(255,59,48)"
    },
    iosKit: {
        ...iOSDefault,
        primaryColor: "rgb(0,122,255)",
        positiveColor: "rgb(0,122,255)"
    }
} 

const DarkTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#000000',
        card: "rgb(28,28,30)",
        text: "#ffffff",
        border: "rgb(50,49,52)",
        interactive: "rgb(0,132,255)",
        placeholder: "rgb(152,151,158)",
        header: "rgb(18,18,18)",
        destructive: "rgb(255,69,58)"
    },
    iosKit: {
        ...iOSDefault,
        primaryColor: "rgb(0,132,255)",
        dividerColor: "rgb(61,61,64)",
        positiveColor: "rgb(0,132,255)"
    }
}

export { LightTheme, DarkTheme };