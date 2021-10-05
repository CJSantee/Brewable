import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { useTheme } from '@react-navigation/native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import Constants from "expo-constants";

const InfoPage = ({ route, navigation }) => {
    const { topic } = route.params;
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <View style={{...styles.card, backgroundColor: colors.card}}>
                <Text style={styles.title}>{topic}</Text>
            </View>
        </View>
    );
}

export default InfoPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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