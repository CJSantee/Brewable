import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useTheme, useFocusEffect } from '@react-navigation/native';

import Header from './components/Header';

function openDatabase() {
    const db = SQLite.openDatabase("CoffeeLab.db");
    return db;
}
  
const db = openDatabase();

const DisplayBeans = ({ route, navigation }) => {
    const [beans, setBeans] = useState({region: "", roaster: "", origin: "", roast_level: "", roast_date: (new Date()).toJSON(), price: 0, weight: 0, weight_unit: "g"});
    const { beans_id } = route.params;
    const {colors} = useTheme();

    const readBeans = () => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * 
                 FROM beans 
                 WHERE id = ?;`,
                [beans_id],
                (_, { rows: { _array } }) =>
                setBeans(_array[0])
            );
        },
        (e) => console.log(e),
        null);
    }

    const options = { weekdate: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    function roastDate() {
        let date = new Date(beans.roast_date);
        return date.toLocaleDateString('en-US', options);
    }

    useFocusEffect(
        useCallback(()=> {
            readBeans();
            return () => {};
        }, [])
    );

    return (
        <View style={{...styles.container, backgroundColor: colors.background}}>
            <Header title="Beans" leftText="Back" rightText="Edit" leftOnPress={() => navigation.goBack()} rightOnPress={null}/>
            <View style={styles.row}>
                <Text style={styles.title}>{beans.roaster} </Text>
                <Text style={styles.subtitle}>{beans.region}</Text>
            </View>
            <View style={styles.row}>
                <Text style={{fontSize: 18}}>{roastDate()}</Text>
            </View>
            <View style={styles.row}>
                <Text>{beans.origin}</Text>
            </View>
            <View style={styles.row}>
                <Text>{beans.weight}{beans.weight_unit}</Text>
            </View>
        </View>
    );
}

export default DisplayBeans;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 5,
        alignItems: 'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 22,
    },
    subtitle: {
        fontSize: 22,
    },
});