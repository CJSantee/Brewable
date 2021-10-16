import React, { useState } from 'react';
import {
   View,
} from 'react-native';
import * as SQLite from 'expo-sqlite';

// Component Imports
import TableView from './components/TableView';
import TextFieldRow from './components/TextFieldRow';
import Header from './components/Header';

// Open SQLite database
function openDatabase() {
    const db = SQLite.openDatabase("CoffeeLab.db");
    return db;
}

const db = openDatabase();

const NewBrewMethod = ({ navigation }) => {
    const [method, setMethod] = useState(""); // New method state

    // Add method to database
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
                    [method]
                );
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