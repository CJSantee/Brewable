import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useTheme, useFocusEffect } from '@react-navigation/native';

import Brew from './Brew';

function openDatabase() {
    const db = SQLite.openDatabase("CoffeeLab.db");
    return db;
}
  
const db = openDatabase();

const BrewList = ({beans, navigation}) => {
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
        }, [brews])
    );

    return (
        <View style={styles.beans}>
            <TouchableOpacity onPress={() => navigation.navigate("Beans", {beans_id: beans.id})}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.title}>{beans.roaster} </Text>
                    <Text style={styles.subtitle}>{beans.region}</Text>
                </View>
            </TouchableOpacity>
            <FlatList
                data={brews}
                horizontal={true}
                renderItem={(item) => 
                    <Brew 
                        brew={item.item} 
                        setFavorite={(value) => db.transaction((tx) => {
                            tx.executeSql("UPDATE brews SET favorite = ? WHERE id = ?;", [value?1:0, item.item.id])
                        }, (e) => console.log(e), null)}
                        navigation={navigation}/>}
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
    },
    subtitle: {
        fontSize: 18,
    },
    brew: {
        marginTop: 5,
        marginRight: 10,
        borderWidth: 0.5,
        borderColor: "rgb(201, 210, 217)",
        width: 300,
        height: 200,
        borderRadius: 10,
        padding: 5,
    },
    wheel: {
        width: "100%",
        height: "100%",
        position: 'absolute',
        top: -10,
        right: -5,
        alignItems: 'flex-end',
    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        marginLeft: 2,
        marginRight: 1,
    },
    notes: {
        overflow: 'hidden',
        width: "55%",
    }
});