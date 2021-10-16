import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    View,
} from 'react-native';
import { SegmentedControl } from 'react-native-ios-kit';
import * as SQLite from 'expo-sqlite';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import TableView from './components/TableView';
import TextFieldRow from './components/TextFieldRow';
import DatePickerRow from './components/DatePickerRow';
import Header from './components/Header';

function openDatabase() {
    const db = SQLite.openDatabase("CoffeeLab.db");
    return db;
}

const db = openDatabase();

const NewBeans = ({ navigation }) => {
    const [beans, setBeans] = useState({region: "", roaster: "", origin: "", roast_level: "", roast_date: new Date(), price: 0, weight: 0, weight_unit: "g"});
    const {colors} = useTheme();
    const user_preferences = useSelector(state => state.user_preferences);

    const addBeans = () => {
        if (beans === null ||  beans.region === "") {
            console.log("Missing Name");
            return false;
        }
    
        db.transaction(
            (tx) => {
                tx.executeSql(`
                    INSERT INTO beans
                    (region, roaster, origin, roast_level, roast_date, price, weight, weight_unit, flavor_notes)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                    [beans.region, beans.roaster, beans.origin, beans.roast_level, beans.roast_date.toJSON(), beans.price, beans.weight, beans.weight_unit, beans.flavor_notes]);
            },
            (e) => {console.log(e)},
            () => navigation.goBack()
        );
    }

    return (
        <View style={{width: "100%", height: "100%"}}>
            <Header 
                title="New Beans" 
                leftText="Cancel" rightText="Done" 
                leftOnPress={() => navigation.goBack()} 
                rightOnPress={() => addBeans()}
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
                    <DatePickerRow title="Roast Date" value={beans.roast_date} onChange={(value) => {setBeans({...beans, roast_date: value});}}/>
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

export default NewBeans;