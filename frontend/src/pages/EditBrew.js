import React, { useCallback, useEffect, useState } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Alert
} from 'react-native';
import { faChevronRight, faStopwatch, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';

// Component Imports
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { SegmentedControl } from 'react-native-ios-kit';
import Header from '../components/Header';
import TableView from '../components/TableView';
import RowItem from '../components/RowItem';
import TextFieldRow from '../components/TextFieldRow';
import SliderRow from '../components/SliderRow';
import DatePickerRow from '../components/DatePickerRow';

const EditBrew = ({ route, navigation }) => {
    const [brew, setBrew] = useState(
        {
            brew_method: "", 
            grind_setting: "", 
            coffee: 0, coffee_unit: "g", 
            water: 0, water_unit: "g", 
            temperature: 0, temp_unit: "f", 
            flavor: 0, acidity: 0, aroma: 0, body: 0, sweetness: 0, aftertaste: 0, 
            notes: "", 
            date: new Date(), 
            time: "",
            beans_id: 0, 
            rating: 0
        }
    ); // Brew state
    const { brew_id } = route.params;
    const {colors} = useTheme(); // Color theme
    const user_preferences = useSelector(state => state.user_preferences); // User preferences (Redux)

    // Update brew in database
    const updateBrew = () => {
        if (brew === null) {
            console.log("error");
            return false;
        }
    
        db.transaction(
            (tx) => {
                tx.executeSql(`
                    UPDATE brews
                    SET grind_setting = ?, water = ?, water_unit = ?, coffee = ?, coffee_unit = ?, temperature = ?,
                    temp_unit = ?, brew_method = ?, time = ?, date = ?, notes = ?, flavor = ?, acidity = ?, aroma = ?,
                    body = ?, sweetness = ?, aftertaste = ?, beans_id = ?, favorite = ?
                    WHERE id = ?;`,
                    [brew.grind_setting, brew.water, brew.water_unit, brew.coffee, brew.coffee_unit, brew.temperature, brew.temp_unit, brew.brew_method, brew.time, new Date(brew.date).toJSON(), brew.notes, brew.flavor, brew.acidity, brew.aroma, brew.body, brew.sweetness, brew.aftertaste, brew.beans_id, brew.favorite, brew.id]);
            },
            (e) => {console.log(e)},
            () => navigation.navigate("DisplayBrew", { brew_id: brew.id })
        );
    }

    // Delete Beans
    const onDelete = (id) => {
        // Delete from database
        db.transaction(
            (tx) => {
                tx.executeSql(
                `DELETE
                FROM brews
                WHERE id = ?;`,
                [id])
            },
            (e) => console.log(e),
            () => navigation.navigate("DisplayBeans", { beans_id: brew.beans_id })
        );
    }

    // Delete Confirmation prompt
    const deleteConfirmation = () => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to permanently delete this brew? You can’t undo this action.",
            [
                {
                    text: "Cancel",
                    onPress: () => {}
                },
                {
                    text: "Yes",
                    onPress: () => onDelete(brew.id)
                }
            ]
        )
    }

    useEffect(() => {
        if (route.params?.brew_method) { // If parent provides brew_method, update brew.brew_method
            setBrew({...brew, brew_method: route.params.brew_method});
        }
        if (route.params?.beans_id) { // If parent provides beans information, update brew
            setBrew({...brew, roaster: route.params.roaster, region: route.params.region, beans_id: route.params.beans_id});
        }
    }, [route.params?.brew_method, route.params?.beans_id]);

    useFocusEffect(
        useCallback(()=> {
            let mounted = true;
            db.transaction(
                (tx) => {
                    tx.executeSql(
                        `SELECT brews.*, beans.roaster, beans.region 
                        FROM brews 
                        LEFT JOIN beans ON brews.beans_id = beans.id
                        WHERE brews.id = ?;`,
                        [brew_id],
                        (_, { rows: { _array } }) => {
                            if (mounted) setBrew(_array[0]);
                        }
                    );
                },
                (e) => console.log(e), null
            );
            return () => mounted = false;
        }, [])
    );

    return (
        <View style={{width: "100%", height: "100%"}}>
            <Header title="Edit Brew" leftText="Cancel" rightText="Done" leftOnPress={() => navigation.goBack()} rightOnPress={() => updateBrew()}/>
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
                <TableView>
                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                    <TouchableOpacity onPress={deleteConfirmation} style={{flex: 1}}>
                        <View style={{...styles.bottomButton, backgroundColor: colors.card, borderColor: colors.border}}>
                            <Text style={{color: colors.destructive, fontSize: 16}}>Delete Brew</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setBrew({...brew, favorite: brew.favorite===0?1:0})} style={{flex: 1}}>
                        <View style={{...styles.bottomButton, backgroundColor: colors.card, borderColor: colors.border}}>
                            <Text style={{color: colors.interactive, fontSize: 16, marginRight: 5}}>Favorite Brew</Text>
                            <FontAwesomeIcon icon={brew.favorite===1?faHeartSolid:faHeart} color={colors.interactive} style={{marginLeft: 5}}/>
                        </View>
                    </TouchableOpacity>
                    </View>
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
    },
    bottomButton: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 15,
        borderWidth: 1,
        padding: 10,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    }
});