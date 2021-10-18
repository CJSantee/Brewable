import React, { useState } from 'react';
import {
   View,
} from 'react-native';
import * as SQLite from 'expo-sqlite';

// Component Imports
import TableView from './components/TableView';
import TextFieldRow from './components/TextFieldRow';
import Header from './components/Header';

const NewFlavor = ({ navigation }) => {
    const [flavor, setFlavor] = useState(""); // New flavor state

    // Add flavor to database
    const addFlavor = () => {
        if (flavor === "") {
            console.log("Missing Value");
            return false;
        }
    
        db.transaction(
            (tx) => {
                tx.executeSql(`
                    INSERT INTO flavors
                    (flavor)
                    VALUES (?);`,
                    [flavor]
                );
            },
            (e) => {console.log(e)},
            () => navigation.goBack()
        );
    }

    return (
        <View style={{width: "100%", height: "100%"}}>
            <Header 
                title="New Flavor" 
                leftText="Cancel" rightText="Done" 
                leftOnPress={() => navigation.goBack()} 
                rightOnPress={() => addFlavor()}/>
            <TableView header="Flavor">
                <TextFieldRow 
                    title="Name"
                    text={flavor}
                    onChange={(value) => setFlavor(value)}    
                />
            </TableView>
        </View>   
        
    );
}

export default NewFlavor;