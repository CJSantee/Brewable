import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import Constants from "expo-constants";

const DisplayBeans = ({ route, navigation }) => {
    const { beans_id } = route.params;

    return (
        <View style={styles.container}>
            <Text>{beans_id}</Text>
        </View>
    );
}

export default DisplayBeans;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight
    },
    card: {
        flex: 1,
        margin: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgb(201, 210, 217)",
        alignItems: 'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 22,
        margin: 5
    }
});