import { DefaultTheme } from '@react-navigation/native';

const CustomTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'rgb(162,132,94)',
        secondary: '#2C1A11',
        background: '#f0f0f0',
        card: "#f9f9f9",
        text: "#000000",
        border: "#c9d2d9",
    }
}
export { CustomTheme };