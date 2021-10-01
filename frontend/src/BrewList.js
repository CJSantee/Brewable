import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useTheme, useFocusEffect } from '@react-navigation/native';

function openDatabase() {
    const db = SQLite.openDatabase("CoffeeLab.db");
    return db;
}
  
const db = openDatabase();

const Brew = ({ brew }) => {
    const {colors} = useTheme();

    return (
        <View style={{...styles.brew, backgroundColor: colors.primary}}>
            <Text>{brew.brew_method}</Text>
        </View>
    );
}

const BrewList = ({beans}) => {
    const [brews, setBrews] = useState([]);

    const readBrews = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM brews WHERE beans_id = ?;",
                [beans.id],
                (_, { rows: { _array } }) =>
                setBrews(_array)
            );
        },
        (e) => console.log(e),
        null);
    }

    useFocusEffect(
        useCallback(()=> {
            readBrews();
            return () => {};
        }, [])
    );

    return (
        <View style={styles.beans}>
            <Text style={styles.title}>{beans.roaster}</Text>
            <FlatList
                data={brews}
                horizontal={true}
                renderItem={(item) => <Brew brew={item.item}/>}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}

export default BrewList;

const styles = StyleSheet.create({
    beans: {
        margin: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 2,
    },
    brew: {
        marginRight: 10,
        borderWidth: 0.5,
        minWidth: 300,
        minHeight: 175,
        borderRadius: 10,
        padding: 5,
    }
});