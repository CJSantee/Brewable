import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from 'react-native';
import { useTheme } from '@react-navigation/native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import TableView from './components/TableView';
import RowItem from './components/RowItem';

import { CustomTheme } from '../Themes';
import Constants from "expo-constants";

const BrewMethods = ({ route, navigation }) => {
    const { selected } = route.params;
    const { colors } = useTheme();

    return (
        <ScrollView style={styles.container}>
            <RowItem
                text="V60"
                onPress={() => { navigation.navigate("main", {method: "V60"}); }}
            >
                {selected === "V60" ? <FontAwesomeIcon icon={faCheck} size={20} color={colors.primary}/> : <View/>}
            </RowItem>
            <RowItem
                text="French Press"
                onPress={() => { navigation.navigate("main", {method: "French Press"}); }}
            >
                {selected === "French Press" ? <FontAwesomeIcon icon={faCheck} size={20} color={colors.primary}/> : <View/>}
            </RowItem>
            <RowItem
                text="Aeropress"
                onPress={() => { navigation.navigate("main", {method: "Aeropress"}); }}
            >
                {selected === "Aeropress" ? <FontAwesomeIcon icon={faCheck} size={20} color={colors.primary}/> : <View/>}
            </RowItem>
        </ScrollView>
    );
}

export default BrewMethods;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: CustomTheme.colors.background, 
    },
    text: {
        color: CustomTheme.colors.text
    }
});