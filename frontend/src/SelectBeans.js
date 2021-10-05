import React, { useCallback, useEffect, useState } from 'react';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList
} from 'react-native';
import * as SQLite from 'expo-sqlite';

import TableView from './components/TableView';
import RowItem from './components/RowItem';

import { CustomTheme } from '../Themes';

function openDatabase() {
    const db = SQLite.openDatabase("CoffeeLab.db");
    return db;
}
  
const db = openDatabase();

const SelectBeans = ({ route, navigation }) => {
    const [beans, setBeans] = useState([]);
    const { selected } = route.params;

    const readBeans = () => {
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM beans;",
            [],
            (_, { rows: { _array } }) =>
                setBeans(_array)
            );
        });
    }

    useFocusEffect(
        useCallback(()=> {
            readBeans();
            return () => {};
        }, [])
    );

    return (
        <FlatList 
            data={beans}
            renderItem={(item) => <RowItem text={item.item.roaster + " - " + item.item.region} onPress={() => { navigation.navigate("main", {beans: (item.item.roaster+" - "+item.item.region), beans_id: item.item.id}); }}/>}
            keyExtractor={item => item.id.toString()}
        />
    );
}

export default SelectBeans;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: CustomTheme.colors.background, 
    },
    text: {
        color: CustomTheme.colors.text
    }
});