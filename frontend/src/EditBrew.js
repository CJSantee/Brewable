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
import { useSelector } from 'react-redux'

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

const updateBrew = (brew) => {
    console.log("Test")
    if (brew === null) {
        console.log("error");
        return false;
    }

    brew = mapFlavors(brew);
    db.transaction(
        (tx) => {
            tx.executeSql(`
                UPDATE brews
                SET grind_setting = ?, water = ?, water_unit = ?, coffee = ?, coffee_unit = ?, temperature = ?,
                temp_unit = ?, brew_method = ?, time = ?, date = ?, notes = ?, flavor = ?, acidity = ?, aroma = ?,
                body = ?, sweetness = ?, aftertaste = ?, beans_id = ?, favorite = ?
                WHERE id = ?;`,
                [brew.grind_setting, brew.water, brew.water_unit, brew.coffee, brew.coffee_unit, brew.temperature, brew.temp_unit, brew.brew_method, brew.time, brew.date, brew.notes, brew.flavor, brew.acidity, brew.aroma, brew.body, brew.sweetness, brew.aftertaste, brew.beans_id,0,beans.id]);
        },
        (e) => {console.log(e)},
        console.log(brew.date)
    );
}

const EditBrew = ({ route, navigation }) => {
    const [brew, setBrew] = useState(route.params.brew);
    const [beans, setBeans] = useState({roaster: "", region: ""});
    const {colors} = useTheme();
    const [timer, setTimer] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const countRef = useRef(null);

    const getBeans = () => {
        db.transaction(
            (tx) => {
                tx.executeSql(`
                    SELECT region, roaster
                    FROM beans
                    WHERE id = ?;`,
                    [brew.beans_id],
                    (_, { rows: { _array } }) =>
                    setBeans(_array[0])
                );
            }, (e) => console.log(e),
            null
        );
    }

    const toggleTimer = () => {
        if (!isActive) {
            setIsActive(true);
            countRef.current = setInterval(() => {
                setTimer((timer) => timer + 1);
            }, 1000);        
        } else {
            clearInterval(countRef.current);
            setIsActive(false);
        }
    }

    const getSeconds = `0${(timer % 60)}`.slice(-2);
    const minutes = `${Math.floor(timer / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);   

    const formatTime = () => {
        return `${getMinutes}:${getSeconds}`;
    }

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
            <Header title="Edit Brew" leftText="Cancel" rightText="Done" leftOnPress={() => navigation.goBack()} rightOnPress={() => { updateBrew(brew); navigation.goBack();}}/>
            <ScrollView style={{...styles.container, backgroundColor: colors.background}}>
                <TableView header="Info">
                    <RowItem
                        title="Beans"
                        text=""
                        onPress={() => navigation.navigate("beansOptions", {selected: brew.beans_id})}
                    >   
                        <Text style={{...styles.text, color: colors.placeholder}}>{brew.roaster} - {brew.region}</Text>
                        <FontAwesomeIcon icon={faChevronRight} size={16} color={colors.placeholder}/>
                    </RowItem>
                    <RowItem
                        title="Brew Method"
                        text=""
                        onPress={() => navigation.navigate("brewMethods", {method: brew.brew_method})}
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
                        onChange={(value) => setBrew({...brew, coffee: value})}
                        keyboardType="decimal-pad"
                    >
                        <SegmentedControl
                            values={['g', 'oz']}
                            selectedIndex={['g', 'oz'].indexOf(brew.coffee_unit)}
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
                            selectedIndex={['g', 'oz', 'ml'].indexOf(brew.water_unit)}
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
                            selectedIndex={['f', 'c'].indexOf(brew.temp_unit)}
                            onValueChange={(value) => setBrew({...brew, temp_unit: value})}
                            style={{width: 100}}
                            theme={{primaryColor: colors.interactive}}
                        />
                    </TextFieldRow>
                </TableView>
                <TableView header="Time">
                    <TextFieldRow
                        title="Brew Time" text={brew.time}
                    >
                        <FontAwesomeIcon icon={faStopwatch} size={25} color={isActive ? "#a00" : colors.interactive}/>
                    </TextFieldRow>
                </TableView>
                <TableView header="Profile">
                    <SliderRow 
                        title="Flavor"
                        value={brew.flavor*20}
                        onValueChange={value => setBrew({...brew, flavor: value})}
                        onPress={() => navigation.navigate("moreInfo",{topic: "Flavor"})}
                    />
                    <SliderRow 
                        title="Acidity"
                        value={brew.acidity*20}
                        onValueChange={value => setBrew({...brew, acidity: value})}
                        onPress={() => navigation.navigate("moreInfo",{topic: "Acidity"})}
                    />
                    <SliderRow 
                        title="Aroma"
                        value={brew.aroma*20}
                        onValueChange={value => setBrew({...brew, aroma: value})}
                        onPress={() => navigation.navigate("moreInfo",{topic: "Aroma"})}
                    />
                    <SliderRow 
                        title="Body"
                        value={brew.body*20}
                        onValueChange={value => setBrew({...brew, body: value})}
                        onPress={() => navigation.navigate("moreInfo",{topic: "Body"})}
                    />
                    <SliderRow 
                        title="Sweetness"
                        value={brew.sweetness*20}
                        onValueChange={value => setBrew({...brew, sweetness: value})}
                        onPress={() => navigation.navigate("moreInfo",{topic: "Sweetness"})}
                    />
                    <SliderRow 
                        title="Aftertaste"
                        value={brew.aftertaste*20}
                        onValueChange={value => setBrew({...brew, aftertaste: value})}
                        onPress={() => navigation.navigate("moreInfo",{topic: "Aftertaste"})}
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