import React, { useState } from 'react';
import {
    ScrollView,
    View,
} from 'react-native';
import { SegmentedControl } from 'react-native-ios-kit';
import * as SQLite from 'expo-sqlite';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';

// Component Imports 
import TableView from './components/TableView';
import TextFieldRow from './components/TextFieldRow';
import DatePickerRow from './components/DatePickerRow';
import Header from './components/Header';

// Open SQLite Databse
function openDatabase() {
    const db = SQLite.openDatabase("CoffeeLab.db");
    return db;
}

const db = openDatabase();

const EditBeans = ({ route, navigation }) => {
    const [beans, setBeans] = useState(route.params.beans); // Retrieve beans data from parent
    const {colors} = useTheme(); // Color theme
    const user_preferences = useSelector(state => state.user_preferences); // User preferences (Redux)

    // Update Beans Database call
    const updateBeans = () => {
        if (beans === null ||  beans.region === "") {
            console.log("Missing Name");
            return false;
        }
    
        db.transaction(
            (tx) => {
                tx.executeSql(`
                    UPDATE beans
                    SET region = ?, roaster = ?, origin = ?, roast_level = ?, roast_date = ?, price = ?, weight = ?, weight_unit = ?, flavor_notes = ?
                    WHERE id = ?;`,
                    [beans.region, beans.roaster, beans.origin, beans.roast_level, new Date(beans.roast_date).toJSON(), beans.price, beans.weight, beans.weight_unit, beans.flavor_notes, beans.id]);
            },
            (e) => {console.log(e)},
            () => navigation.goBack() // Go back on success
        );
    }

    return (
        <View style={{width: "100%", height: "100%"}}>
            <Header 
                title="Edit Beans" 
                leftText="Cancel" rightText="Done" 
                leftOnPress={() => navigation.goBack()} 
                rightOnPress={() => updateBeans()}
            />
            <ScrollView>
                <TableView header="Roast">
                    <TextFieldRow 
                        title="Roaster"
                        text={beans.roaster}
                        onChange={(value) => setBeans({...beans, roaster: value})}    
                    />
                    <TextFieldRow 
                        title="Region"
                        text={beans.region}
                        onChange={(value) => setBeans({...beans, region: value})}    
                    />
                    <TextFieldRow 
                        title="Origin"
                        text={beans.origin}
                        onChange={(value) => setBeans({...beans, origin: value})}    
                    />
                    <TextFieldRow 
                        title="Roast Level"
                        text={beans.roast_level}
                        onChange={(value) => setBeans({...beans, roast_level: value})}    
                    />
                </TableView>
                <TableView header="Bag">
                    <DatePickerRow title="Roast Date" value={beans.roast_date} onChange={(value) => setBeans({...beans, roast_date: value})}/>
                    <TextFieldRow 
                        title="Price"
                        text={beans.price}
                        onChange={(value) => setBeans({...beans, price: value})}
                        keyboardType="decimal-pad"
                    />
                    <TextFieldRow 
                        title="Weight"
                        text={beans.weight}
                        onChange={(value) => setBeans({...beans, weight: value})}
                        keyboardType="decimal-pad"
                    >
                        <SegmentedControl
                            values={['g', 'oz']}
                            selectedIndex={['g', 'oz'].indexOf(user_preferences.coffe_unit)}
                            onValueChange={(value) => setBeans({...beans, weight_unit: value})}
                            style={{width: 100}}
                            theme={{primaryColor: colors.interactive}}
                        />
                    </TextFieldRow>
                </TableView>
            </ScrollView>
        </View>   
        
    );
}

export default EditBeans;