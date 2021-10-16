import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    View,
} from 'react-native';
import { SegmentedControl } from 'react-native-ios-kit';
import * as SQLite from 'expo-sqlite';
import { useTheme } from '@react-navigation/native';

import TableView from './components/TableView';
import TextFieldRow from './components/TextFieldRow';
import DatePickerRow from './components/DatePickerRow';
import Header from './components/Header';

function openDatabase() {
    const db = SQLite.openDatabase("CoffeeLab.db");
    return db;
}

const db = openDatabase();

const NewBrewMethod = ({ navigation }) => {
    const [method, setMethod] = useState("");
    const {colors} = useTheme();

    const addMethod = () => {
        if (method === "") {
            console.log("Missing Value");
            return false;
        }
    
        db.transaction(
            (tx) => {
                tx.executeSql(`
                    INSERT INTO brew_methods
                    (method)
                    VALUES (?);`,
                    [method]);
            },
            (e) => {console.log(e)},
            () => navigation.goBack()
        );
    }

    return (
        <View style={{width: "100%", height: "100%"}}>
            <Header 
                title="New Brew Method" 
                leftText="Cancel" rightText="Done" 
                leftOnPress={() => navigation.goBack()} 
                rightOnPress={() => addMethod()}/>
            <TableView header="Brew Method">
                <TextFieldRow 
                    title="Name"
                    text={method}
                    onChange={(value) => setMethod(value)}    
                />
            </TableView>
        </View>   
        
    );
}

export default NewBrewMethod;