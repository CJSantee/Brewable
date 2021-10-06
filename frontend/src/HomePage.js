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
import { faPlus, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Constants from "expo-constants";

import BrewList from './BrewList';
import Header from './components/Header';
import RowItem from './components/RowItem';

function openDatabase() {
    const db = SQLite.openDatabase("CoffeeLab.db");
    return db;
}
  
const db = openDatabase();

const Modal = ({ navigation }) => {
    const {colors} = useTheme();
    return (
        <View style={styles.modal}>
            <RowItem title="Beans" text="" onPress={() => navigation.navigate("New Beans")}>
                <FontAwesomeIcon icon={faChevronRight} size={20} color={colors.primary}/>
            </RowItem>
            <RowItem title="Brew" text="" onPress={() => navigation.navigate("New Brew")}>
                <FontAwesomeIcon icon={faChevronRight} size={20} color={colors.primary}/>
            </RowItem>
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
            <Header title="Brews" leftText="" rightText="New" leftOnPress={null} rightOnPress={()=>setModal(!modal)}/>
            {modal ? <Modal navigation={navigation}/> : <View/>}
            {beans === null || beans.length === 0 ? <View/> : 
            <FlatList 
                data={beans}
                renderItem={(object) => <BrewList beans={object.item} navigation={navigation}/>}
                keyExtractor={item => item.id.toString()}
            />}
        </View>
    );
}

export default HomePage;

const styles = StyleSheet.create({
    button: {
        backgroundColor: "rgb(180, 135, 117)",
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 80,
        height: 80,
        borderRadius: 40, 
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
    },
    modal: {
        zIndex: 1,
        borderColor: "rgb(201, 210, 217)",
        borderBottomWidth: 1
    },
    text: {
        fontSize: 18,
    }
});