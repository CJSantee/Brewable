import React, { memo, useCallback, useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    FlatList
} from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import RowItem from './components/RowItem';
import Header from './components/Header';

function openDatabase() {
    const db = SQLite.openDatabase("CoffeeLab.db");
    return db;
}
  
const db = openDatabase();

const BrewMethods = ({ route, navigation }) => {
    const [methods, setMethods] = useState([]);
    const { method } = route.params;
    const { colors } = useTheme();
    const [editing, setEditing]= useState(false);
    const [selected, setSelected] = useState(new Set());

    function toggleEditing() {
        setEditing(!editing);
        setSelected(new Set());
    }

    function toggleSelected(value) {
        if (selected.has(value)) {
            let newSet = new Set(selected);
            newSet.delete(value);
            setSelected(newSet);
        } else {
            let newSet = new Set(selected);
            newSet.add(value);
            setSelected(newSet);
        }
    }

    const deleteSelected = () => {
        db.transaction((tx) => {
            selected.forEach((value) => 
                tx.executeSql("DELETE FROM brew_methods WHERE method = ?;", [value])
            );
        },
        (e) => console.log(e),
        null);
        toggleEditing();
    }
    
    const readMethods = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM brew_methods;",
                [],
                (_, { rows: { _array } }) =>
                setMethods(_array)
            );
        },
        (e) => console.log(e),
        null);
    }

    useEffect(() => {
        readMethods();
        return () => {}; // Solution to "Warning: Can't perform a React state update on an unmounted component."
    },[]);

    return (
        <View style={{height: "100%", width: "100%"}}>  
            <Header 
                title="Brew Method" 
                leftText={editing?"Delete":"Back"}
                rightText={editing?"Done":"Edit"}
                leftOnPress={editing?deleteSelected:() => navigation.goBack()} 
                leftChevron={editing?false:true}  
                rightOnPress={toggleEditing}
                plus={true} plusOnPress={() => navigation.navigate("addMethod")}
            />
            <FlatList 
                data={methods}
                renderItem={(item) => 
                    <RowItem 
                        title={item.item.method} text=""
                        onPress={() => { navigation.navigate("main", {method: item.item.method}); }}
                        showSelect={editing}
                        selected={selected.has(item.item.method)}
                        toggleSelect={(value) => toggleSelected(value)}
                    >
                        {method === item.item.method ? <FontAwesomeIcon icon={faCheck} size={20} color={colors.placeholder}/> : <View/>}
                    </RowItem>  
                }
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}

export default BrewMethods;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
    }
});