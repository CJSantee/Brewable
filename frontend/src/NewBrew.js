import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
} from 'react-native';
import { CustomTheme } from '../Themes';
import Constants from "expo-constants";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { SegmentedControl } from 'react-native-ios-kit';
import { useTheme } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

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

function mapFlavors(brew) {
    console.log(brew);

    brew.flavor = mapFlavor(brew.flavor);
    brew.acidity = mapFlavor(brew.acidity);``
    brew.aroma = mapFlavor(brew.aroma);
    brew.body = mapFlavor(brew.body);
    brew.sweetness = mapFlavor(brew.sweetness);
    brew.aftertaste = mapFlavor(brew.aftertaste);

    console.log(brew);
    return brew;
}

const addBrew = (brew) => {
    if (brew === null) {
        console.log("error");
        return false;
    }

    brew = mapFlavors(brew);
    db.transaction(
        (tx) => {
            tx.executeSql(`
                INSERT INTO brews
                (grind_setting, water, coffee, temperature, brew_method, date, notes, flavor, acidity, aroma, body, sweetness, aftertaste, beans_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [brew.grind_setting, brew.water, brew.coffee, brew.temperature, brew.brew_method, brew.date, brew.notes, brew.flavor, brew.acidity, brew.aroma, brew.body, brew.sweetness, brew.aftertaste, brew.beans_id]);
        },
        (e) => {console.log(e)},
        null
    );
}

const NewBrew = ({ route, navigation }) => {
    const [brew, setBrew] = useState({beans: "Select Beans", brew_method: "Select Brew Method", grind_setting: "", coffee: 0, water: 0, temperature: 0, flavor: 0, acidity: 0, aroma: 0, body: 0, sweetness: 0, aftertaste: 0, notes: "", date: new Date(), beans_id: 0});
    const {colors} = useTheme();

    useEffect(() => {
        if (route.params?.method) {
            setBrew({...brew, brew_method: route.params.method});
        }
        if (route.params?.beans) {
            setBrew({...brew, beans: route.params.beans, beans_id: route.params.beans_id});
        }
    }, [route.params?.method, route.params?.beans]);

    return (
        <View style={{width: "100%", height: "100%"}}>
            <Header title="New Brew" leftText="Cancel" rightText="Done" leftOnPress={() => navigation.goBack()} rightOnPress={() => { addBrew(brew); navigation.goBack();}}/>
            <ScrollView style={styles.container}>
                <TableView header="Beans">
                    <RowItem
                        text={brew.beans}
                        onPress={() => navigation.navigate("beansOptions", {selected: null})}
                    >   
                        <FontAwesomeIcon icon={faChevronRight} size={20} color={colors.primary}/>
                    </RowItem>
                </TableView>
                <TableView header="Method">
                    <RowItem
                        text={brew.brew_method}
                        onPress={() => navigation.navigate("brewMethods", {selected: brew.brew_method})}
                    >   
                        <FontAwesomeIcon icon={faChevronRight} size={20} color={colors.primary}/>
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
                        onChange={(value) => setBrew({...brew, coffee: value})}
                        keyboardType="decimal-pad"
                    >
                        <SegmentedControl
                            values={['g', 'oz']}
                            selectedIndex={0}
                            onValueChange={() => setBrew({...brew})}
                            style={{width: 100}}
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
                            selectedIndex={0}
                            onValueChange={() => setBrew({...brew})}
                            style={{width: 100}}
                        />
                    </TextFieldRow>
                    <TextFieldRow
                        title="Temperature"
                        text={brew.temperature}
                        onChange={(value) => setBrew({...brew, temperature: value})}
                    >
                        <SegmentedControl
                            values={['f', 'c']}
                            selectedIndex={0}
                            onValueChange={() => setBrew({...brew})}
                            style={{width: 100}}
                        />
                    </TextFieldRow>
                </TableView>
                <TableView header="Profile">
                    <SliderRow 
                        title="Flavor"
                        value={brew.flavor}
                        onValueChange={value => setBrew({...brew, flavor: value})}
                    />
                    <SliderRow 
                        title="Acidity"
                        value={brew.acidity}
                        onValueChange={value => setBrew({...brew, acidity: value})}
                    />
                    <SliderRow 
                        title="Aroma"
                        value={brew.aroma}
                        onValueChange={value => setBrew({...brew, aroma: value})}
                    />
                    <SliderRow 
                        title="Body"
                        value={brew.body}
                        onValueChange={value => setBrew({...brew, body: value})}
                    />
                    <SliderRow 
                        title="Sweetness"
                        value={brew.sweetness}
                        onValueChange={value => setBrew({...brew, sweetness: value})}
                    />
                    <SliderRow 
                        title="Aftertaste"
                        value={brew.aftertaste}
                        onValueChange={value => setBrew({...brew, aftertaste: value})}
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

export default NewBrew;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: CustomTheme.colors.background, 
    },
    text: {
        color: CustomTheme.colors.text
    }
});