import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useTheme, useFocusEffect } from '@react-navigation/native';

import Header from './components/Header';
import Brew from './Brew';

function openDatabase() {
    const db = SQLite.openDatabase("CoffeeLab.db");
    return db;
}
  
const db = openDatabase();

const DisplayBeans = ({ route, navigation }) => {
    const [beans, setBeans] = useState({region: "", roaster: "", origin: "", roast_level: "", roast_date: new Date(), price: 0, weight: 0, weight_unit: "g"});
    const [brews, setBrews] = useState([]);
    const { beans_id } = route.params;
    const {colors} = useTheme();

    function readBeans() {
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

    function readBrews() {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM brews WHERE beans_id = ?;",
                [beans_id],
                (_, { rows: { _array } }) =>
                setBrews(_array)
            );
        },
        (e) => console.log(e),
        null);
    }

    const options = { weekdate: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    function roastDate() {
        if (beans.roast_date === "") return "";
        let date = new Date(beans.roast_date);
        return date.toLocaleDateString('en-US', options);
    }

    useFocusEffect(
        useCallback(()=> {
            readBeans();
            readBrews();
            return () => {};
        }, [])
    );

    return (
        <View style={{...styles.container, backgroundColor: colors.background}}>
            <Header 
                title="Beans" 
                leftText="Back" rightText="Edit" 
                leftOnPress={() => navigation.goBack()} 
                rightOnPress={() => navigation.navigate("EditBeans", {beans: beans})}/>
            <View style={styles.row}>
                <Text style={styles.title}>{beans.roaster} </Text>
                <Text style={styles.subtitle}>{beans.region}</Text>
            </View>
            <View style={styles.row}>
                {roastDate()!==""?<Text style={{fontSize: 18}}>{roastDate()}</Text>:<View/>}
                <Text style={{fontSize: 18}}> - {beans.weight}{beans.weight_unit}</Text>
            </View>
            <View style={styles.row}>
                <Text>{beans.origin}</Text>
            </View>
            <View style={styles.col}>
                <Text style={{fontSize: 14, color: colors.placeholder}}>{brews.length === 0?"No Brews":"- Brews -"}</Text>
                <FlatList
                    data={brews}
                    style={{alignSelf: 'center'}}
                    horizontal={false}
                    renderItem={(item) => <Brew brew={item.item} navigation={navigation}/>}
                    keyExtractor={item => item.id.toString()}
                />
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
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    col: {
        flexDirection: 'column',
        marginHorizontal: 10,
        marginVertical: 5,
        justifyContent: 'center',
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