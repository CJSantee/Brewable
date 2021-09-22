import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from 'react-native';

import TableView from './components/TableView';
import RowItem from './components/RowItem';

import { CustomTheme } from '../Themes';
import Constants from "expo-constants";

const BrewMethods = ({ route, navigation }) => {
    const { selected } = route.params;

    return (
        <ScrollView style={styles.container}>
            <RowItem
                text="V60"
                onPress={() => { navigation.navigate("main", {selected: "V60"}); }}
            />
            <RowItem
                text="French Press"
                onPress={() => { navigation.navigate("main", {selected: "French Press"}); }}
            />
            <RowItem
                text="Aeropress"
                onPress={() => { navigation.navigate("main", {selected: "Aeropress"}); }}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: CustomTheme.colors.background, 
        marginTop: Constants.statusBarHeight
    },
    text: {
        color: CustomTheme.colors.text
    }
})

export default BrewMethods;