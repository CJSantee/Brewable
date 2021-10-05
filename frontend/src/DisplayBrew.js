import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import Constants from "expo-constants";

import Header from './components/Header';

function openDatabase() {
    const db = SQLite.openDatabase("CoffeeLab.db");
    return db;
}
  
const db = openDatabase();

const DisplayBrew = ({ route, navigation }) => {
    const [brew, setBrew] = useState({});
    const { brew_id } = route.params;
    const {colors} = useTheme();

    const readBrew = () => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * 
                 FROM brews 
                 LEFT JOIN beans ON brews.beans_id = brews.id
                 WHERE brews.id = ?;`,
                [brew_id],
                (_, { rows: { _array } }) =>
                setBrew(_array[0])
            );
        },
        (e) => console.log(e),
        null);
    }

    useFocusEffect(
        useCallback(()=> {
            readBrew();
            return () => {};
        }, [])
    );

    return (
        <View style={{...styles.container, backgroundColor: colors.background}}>
            <Header title="New Beans" leftText="Back" rightText="" leftOnPress={() => navigation.goBack()} rightOnPress={null}/>
            <Text>{brew.roaster}</Text>
            <Text>{brew.region}</Text>
        </View>
    );
}

export default DisplayBrew;

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