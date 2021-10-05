import React, { useCallback, useState } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    TextInput,
    Text,
    FlatList,
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Constants from "expo-constants";

import BrewList from './BrewList';

let {height, width} = Dimensions.get('window');

function openDatabase() {
    const db = SQLite.openDatabase("CoffeeLab.db");
    return db;
}
  
const db = openDatabase();

const Modal = ({ navigation }) => {
    return (
        <View style={styles.modal}>
            <TouchableOpacity onPress={() => navigation.navigate("New Beans")}>
                <Text style={styles.text}>Beans</Text>
            </TouchableOpacity>
            <View style={{borderBottomWidth: 0.5, width: "80%"}}/>
            <TouchableOpacity onPress={() => navigation.navigate("New Brew")}>
                <Text style={styles.text}>Brew</Text>
            </TouchableOpacity>
        </View>
    );
}

const HomePage = ({ navigation }) => {
    const {colors} = useTheme();
    const [modal, setModal] = useState(false);
    const [beans, setBeans] = useState([]);

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
            setModal(false);
            readBeans();
            return () => {};
        }, [])
    );

    return (
        <View style={{flex: 1, flexDirection: 'column', backgroundColor: colors.background}}>  
            <View style={styles.header}>
                <View style={styles.searchBar}>
                    <TextInput style={{flex: 1, marginLeft: 10}}/>
                </View>
                <View style={styles.button}>
                    <TouchableOpacity onPress={() => setModal(!modal)}>
                        <FontAwesomeIcon icon={faPlus} size={30}/>
                    </TouchableOpacity>
                </View>
            </View>
            {modal ? <Modal navigation={navigation}/> : <View/>}
            {beans === null || beans.length === 0 ? <View/> : 
            <FlatList 
                data={beans}
                renderItem={(object) => <BrewList beans={object.item} onPress={() => navigation.navigate("Beans", {beans_id: object.item.id})}/>}
                keyExtractor={item => item.id.toString()}
            />}
        </View>
    );
}

export default HomePage;

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#c9b79c",
        width: "100%",
        height: "13%",
        paddingTop: Constants.statusBarHeight,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    searchBar: {
        backgroundColor: "#9a9a9a",
        flex: 4,
        height: "60%",
        borderRadius: 40,
    },
    button: {
        backgroundColor: "#71816d",
        flex: 1, 
        height: "60%",
        borderRadius: 40, 
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
    },
    modal: {
        zIndex: 1,
        backgroundColor: "#71816d",
        height: 100,
        width: 100,
        position: 'absolute',
        right: 10,
        top: "13.5%",
        borderRadius: 25,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderWidth: 0.5
    },
    text: {
        fontSize: 18,
    }
});