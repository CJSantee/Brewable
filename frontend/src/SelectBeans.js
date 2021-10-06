import React, { useCallback, useEffect, useState } from 'react';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import {
    View,
    FlatList
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import RowItem from './components/RowItem';

function openDatabase() {
    const db = SQLite.openDatabase("CoffeeLab.db");
    return db;
}
  
const db = openDatabase();

const SelectBeans = ({ route, navigation }) => {
    const [beans, setBeans] = useState([]);
    const { selected } = route.params;
    const { colors } = useTheme();

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
            renderItem={(item) => 
                <RowItem 
                    title={item.item.roaster + " - " + item.item.region} 
                    text=""
                    onPress={() => { navigation.navigate("main", {beans: (item.item.roaster+" - "+item.item.region), beans_id: item.item.id}); }}>
                    {selected === item.item.id ? <FontAwesomeIcon icon={faCheck} size={20} color={colors.primary}/> : <View/>}
                </RowItem>}
            keyExtractor={item => item.id.toString()}
        />
    );
}

export default SelectBeans;
