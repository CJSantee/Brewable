import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';

import Brew from './Brew';

const BrewList = ({ beans, navigation }) => {
    const [brews, setBrews] = useState([]);

    // Set Brew as Favorite
    const setFavorite = (value, id) => {
        db.transaction(
            (tx) => {
                tx.executeSql("UPDATE brews SET favorite = ? WHERE id = ?;", [value?1:0, id])
            }, 
            (e) => console.log(e), 
            null
        );
    }

    // Update brews for given beans_id when component is mounted
    useFocusEffect(
        useCallback(()=> {
            let mounted = true;
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM brews WHERE beans_id = ?;",
                    [beans.id],
                    (_, { rows: { _array } }) => {
                        if (mounted) setBrews(_array);
                });
            });
            return () => mounted = false;
        }, [brews])
    );

    return (
        <View style={styles.beans}>
            <TouchableOpacity onPress={() => navigation.navigate("DisplayBeans", {beans_id: beans.id})}>
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
                        setFavorite={(value) => setFavorite(value, item.item.id)}
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