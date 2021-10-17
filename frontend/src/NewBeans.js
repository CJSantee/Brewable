import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    View,
    StyleSheet,
    Text
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

// Component Imports
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { SegmentedControl } from 'react-native-ios-kit';
import TableView from './components/TableView';
import TextFieldRow from './components/TextFieldRow';
import DatePickerRow from './components/DatePickerRow';
import RowItem from './components/RowItem';
import Header from './components/Header';

// Open SQLite Database
function openDatabase() {
    const db = SQLite.openDatabase("CoffeeLab.db");
    return db;
}

const db = openDatabase();

const NewBeans = ({ route, navigation }) => {
    const [beans, setBeans] = useState({region: "", roaster: "", origin: "", roast_level: "", roast_date: new Date(), price: 0, weight: 0, weight_unit: "g", flavor_notes: ""}); // Beans state
    const {colors} = useTheme(); // Color theme
    const user_preferences = useSelector(state => state.user_preferences); // User preferences (Redux)

    // Add beans to database
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

    useEffect(() => {
        if (route.params?.flavor_notes) { // If parent provides flavor_notes, update beans.flavor_notes
            setBeans({ ...beans, flavor_notes: route.params.flavor_notes});
        } else {
            setBeans({ ...beans, flavor_notes: "" })
        }
    }, [route.params?.flavor_notes]);

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
                            selectedIndex={['g', 'oz'].indexOf(user_preferences.coffee_unit)}
                            onValueChange={(value) => setBeans({...beans, weight_unit: value})}
                            style={{width: 100}}
                            theme={{primaryColor: colors.interactive}}
                        />
                    </TextFieldRow>
                    
                </TableView>
                <TableView header="Flavor">
                    <RowItem
                        title="Flavor Notes"
                        text=""
                        onPress={() => navigation.navigate("SelectFlavors", { parent: "NewBeans", flavor_notes: beans.flavor_notes })}
                    >   
                        <FontAwesomeIcon icon={faChevronRight} size={16} color={colors.placeholder}/>
                    </RowItem>
                    <View style={styles.flavors}>
                        {beans.flavor_notes !== "" ? beans.flavor_notes.split(',').map((item) => 
                            <View key={item} style={styles.flavor}>
                                <Text style={styles.flavorText}>{item}</Text>
                            </View>
                        ) : <View/>}
                    </View>
                </TableView>
                
            </ScrollView>
        </View>   
        
    );
}

export default NewBeans;

const styles = StyleSheet.create({
    flavors: {
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },  
    flavor: {
        display: 'flex',
        marginHorizontal: 10,
        marginBottom: 15,
        borderWidth: 1,
        padding: 10,
        borderRadius: 15
    },
    flavorText: {
        fontSize: 16
    }
});