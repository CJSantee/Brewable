import { DefaultTheme } from '@react-navigation/native';

const CustomTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#71816d',
        // background: "#000",
        card: "#F9F9F9",
        placeholder: "#8A8A8F",
        // text: "#fff",
        // border: "#eee",
        // notification: "#00f",
    }
}
export { CustomTheme };