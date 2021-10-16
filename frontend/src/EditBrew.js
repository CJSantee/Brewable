import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { SegmentedControl } from 'react-native-ios-kit';
import { useTheme } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import { useSelector } from 'react-redux';

import Header from './components/Header';
import TableView from './components/TableView';
import RowItem from './components/RowItem';
import TextFieldRow from './components/TextFieldRow';
import SliderRow from './components/SliderRow';
import DatePickerRow from './components/DatePickerRow';

function openDatabase() {
    const db = SQLite.openDatabase("CoffeeLab.db");
    return db;
}

const db = openDatabase();

function mapFlavor(value) {
    if (value <= 10)
        return 0;
    else if (value >= 90)
        return 5;
    else 
        return Math.floor((value-10)/20)+1;
}
// Maps the values of the flavor wheel from 0-100 to 0-5
function mapFlavors(brew) {
    brew.flavor = mapFlavor(brew.flavor);
    brew.acidity = mapFlavor(brew.acidity);``
    brew.aroma = mapFlavor(brew.aroma);
    brew.body = mapFlavor(brew.body);
    brew.sweetness = mapFlavor(brew.sweetness);
    brew.aftertaste = mapFlavor(brew.aftertaste);
    return brew;
}

const EditBrew = ({ route, navigation }) => {
    const [brew, setBrew] = useState(route.params.brew);
    const {colors} = useTheme();
    const user_preferences = useSelector(state => state.user_preferences);

    const updateBrew = () => {
        let newBrew = {...brew};

        if (brew === null) {
            console.log("error");
            return false;
        }
    
        newBrew = mapFlavors(brew);

        db.transaction(
            (tx) => {
                tx.executeSql(`
                    UPDATE brews
                    SET grind_setting = ?, water = ?, water_unit = ?, coffee = ?, coffee_unit = ?, temperature = ?,
                    temp_unit = ?, brew_method = ?, time = ?, date = ?, notes = ?, flavor = ?, acidity = ?, aroma = ?,
                    body = ?, sweetness = ?, aftertaste = ?, beans_id = ?, favorite = ?
                    WHERE id = ?;`,
                    [brew.grind_setting, newBrew.water, newBrew.water_unit, newBrew.coffee, newBrew.coffee_unit, newBrew.temperature, newBrew.temp_unit, newBrew.brew_method, newBrew.time, new Date(brew.date).toJSON(), newBrew.notes, newBrew.flavor, newBrew.acidity, newBrew.aroma, newBrew.body, newBrew.sweetness, newBrew.aftertaste, newBrew.beans_id, 0, newBrew.id]);
            },
            (e) => {console.log(e)},
            () => navigation.navigate("DisplayBrew", { brew_id: newBrew.id })
        );
    }

    useEffect(() => {
        if (route.params?.method) {
            setBrew({...brew, brew_method: route.params.method});
        }
        if (route.params?.beans_id) {
            setBrew({...brew, roaster: route.params.roaster, region: route.params.region, beans_id: route.params.beans_id});
        }
    }, [route.params?.method, route.params?.beans_id]);

    return (
        <View style={{width: "100%", height: "100%"}}>
            <Header title="Edit Brew" leftText="Cancel" rightText="Done" leftOnPress={() => navigation.navigate("DisplayBrew", { brew_id: brew.id })} rightOnPress={() => updateBrew()}/>
            <ScrollView style={{...styles.container, backgroundColor: colors.background}}>
                <TableView header="Info">
                    <RowItem
                        title="Beans"
                        text=""
                        onPress={() => navigation.navigate("SelectBeans", {beans_id: brew.beans_id, parent: "EditBrew"})}
                    >   
                        <Text style={{...styles.text, color: colors.placeholder}}>{brew.roaster} - {brew.region}</Text>
                        <FontAwesomeIcon icon={faChevronRight} size={16} color={colors.placeholder}/>
                    </RowItem>
                    <RowItem
                        title="Brew Method"
                        text=""
                        onPress={() => navigation.navigate("BrewMethods", {brew_method: brew.brew_method, parent: "EditBrew"})}
                    >   
                        <Text style={{...styles.text, color: colors.placeholder}}>{brew.brew_method}</Text>
                        <FontAwesomeIcon icon={faChevronRight} size={16} color={colors.placeholder}/>
                    </RowItem>
                </TableView>
                    
                <TableView header="Recipe">
                    <TextFieldRow 
                        title="Grind Setting"
                        text={brew.grind_setting}
                        onChange={(value) => setBrew({...brew, grind_setting: value})}
                    />
                    <TextFieldRow
                        title="Coffee Amount"
                        text={brew.coffee}
                        onChange={(value) => setBrew({...brew, coffee: value, water: value*user_preferences.ratio})}
                        keyboardType="decimal-pad"
                    >
                        <SegmentedControl
                            values={['g', 'oz']}
                            selectedIndex={['g', 'oz'].indexOf(user_preferences.coffee_unit)}
                            onValueChange={(value) => setBrew({...brew, coffee_unit: value})}
                            style={{width: 100}}
                            theme={{primaryColor: colors.interactive}}
                        />
                    </TextFieldRow>
                    <TextFieldRow
                        title="Water Amount"
                        text={brew.water}
                        onChange={(value) => setBrew({...brew, water: value})}
                        keyboardType="decimal-pad"
                    >
                        <SegmentedControl
                            values={['g', 'oz', 'ml']}
                            selectedIndex={['g', 'oz', 'ml'].indexOf(user_preferences.water_unit)}
                            onValueChange={(value) => setBrew({...brew, water_unit: value})}
                            style={{width: 100}}
                            theme={{primaryColor: colors.interactive}}
                        />
                    </TextFieldRow>
                    <TextFieldRow
                        title="Temperature"
                        text={brew.temperature}
                        onChange={(value) => setBrew({...brew, temperature: value})}
                        keyboardType="decimal-pad"
                    >
                        <SegmentedControl
                            values={['f', 'c']}
                            selectedIndex={['f', 'c'].indexOf(user_preferences.temp_unit)}
                            onValueChange={(value) => setBrew({...brew, temp_unit: value})}
                            style={{width: 100}}
                            theme={{primaryColor: colors.interactive}}
                        />
                    </TextFieldRow>
                </TableView>
                <TableView header="Time">
                    <TextFieldRow
                        title="Brew Time" text={brew.time} onChange={(value) => setBrew({...brew, time: value})}
                    >
                        <FontAwesomeIcon icon={faStopwatch} size={25} color={colors.interactive}/>
                    </TextFieldRow>
                </TableView>
                <TableView header="Profile">
                    <SliderRow 
                        title="Flavor"
                        value={brew.flavor}
                        onValueChange={value => setBrew({...brew, flavor: value})}
                        onPress={() => navigation.navigate("InfoPage",{topic: "Flavor"})}
                    />
                    <SliderRow 
                        title="Acidity"
                        value={brew.acidity}
                        onValueChange={value => setBrew({...brew, acidity: value})}
                        onPress={() => navigation.navigate("InfoPage",{topic: "Acidity"})}
                    />
                    <SliderRow 
                        title="Aroma"
                        value={brew.aroma}
                        onValueChange={value => setBrew({...brew, aroma: value})}
                        onPress={() => navigation.navigate("InfoPage",{topic: "Aroma"})}
                    />
                    <SliderRow 
                        title="Body"
                        value={brew.body}
                        onValueChange={value => setBrew({...brew, body: value})}
                        onPress={() => navigation.navigate("InfoPage",{topic: "Body"})}
                    />
                    <SliderRow 
                        title="Sweetness"
                        value={brew.sweetness}
                        onValueChange={value => setBrew({...brew, sweetness: value})}
                        onPress={() => navigation.navigate("InfoPage",{topic: "Sweetness"})}
                    />
                    <SliderRow 
                        title="Aftertaste"
                        value={brew.aftertaste}
                        onValueChange={value => setBrew({...brew, aftertaste: value})}
                        onPress={() => navigation.navigate("InfoPage",{topic: "Aftertaste"})}
                    />
                </TableView>
                <TableView header="More Info">
                    <TextFieldRow title="Notes" text={brew.notes} onChange={(value) => setBrew({...brew, notes: value})} style={{minHeight: 129, alignItems: 'baseline'}}/>
                </TableView>
                <TableView header="Date">  
                    <DatePickerRow value={brew.date} onChange={(value) => setBrew({...brew, date: value})}/>
                </TableView>
            </ScrollView>
        </View>
    );
}

export default EditBrew;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
    },
    text: {
        fontSize: 17,
        marginRight: 5
    }
});