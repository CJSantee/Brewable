import React, { useCallback, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert
} from 'react-native';
import { Feather, Ionicons, FontAwesome } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useFocusEffect, useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { acidity, aftertaste, aroma, body, flavor, overall, sweetness } from '../utils/Descriptions';

// Component Imports
import { SegmentedControl } from 'react-native-ios-kit';
import Header from '../components/Header';
import TableView from '../components/TableView';
import RowItem from '../components/RowItem';
import TextFieldRow from '../components/TextFieldRow';
import SliderRow from '../components/SliderRow';
import DatePickerRow from '../components/DatePickerRow';
import RatingRow from '../components/RatingRow';
import ProfileModal from '../components/ProfileModal';

const EditBrew = ({ route, navigation }) => {
    const [brew, setBrew] = useState(
        {
            brew_method: "", 
            grind_setting: 0, 
            coffee: 0, coffee_unit: "g", 
            water: 0, water_unit: "g", 
            temperature: 0, temp_unit: "f", 
            flavor: 0, acidity: 0, aroma: 0, body: 0, sweetness: 0, aftertaste: 0, 
            notes: "", 
            date: new Date(), 
            time: "",
            bloom: "",
            beans_id: 0, 
            rating: 0,
            roaster: "", region: ""
        }
    ); // Brew state
    const [showFlavorModal, setShowFlavorModal] = useState(false);
    const [modalValues, setModalValues] = useState({title: "", text: ""});
    const [showBloom, setShowBloom] = useState(false);
    const { parent, brew_id } = route.params;
    const { colors } = useTheme(); // Color theme
    const user_preferences = useSelector(state => state.user_preferences); // User preferences (Redux)
    
    // Alert for missing Brew Info
    const missingInfoAlert = () => {
        Alert.alert(
            "Missing Fields",
            "Please select Beans and Brew Method",
            [
                {text: "OK"}
            ]
        )
    }

    // Update brew in database
    const updateBrew = () => {
        if (brew.beans_id === "" || brew.brew_method === "") {
            missingInfoAlert();
            return false;
        }
    
        db.transaction(
            (tx) => {
                tx.executeSql(`
                    UPDATE brews
                    SET grind_setting = ?, water = ?, water_unit = ?, coffee = ?, coffee_unit = ?, temperature = ?,
                    temp_unit = ?, brew_method = ?, time = ?, date = ?, notes = ?, flavor = ?, acidity = ?, aroma = ?,
                    body = ?, sweetness = ?, aftertaste = ?, beans_id = ?, favorite = ?, rating = ?
                    WHERE id = ?;`,
                    [brew.grind_setting, brew.water, brew.water_unit, brew.coffee, brew.coffee_unit, brew.temperature, brew.temp_unit, brew.brew_method, brew.time, new Date(brew.date).toJSON(), brew.notes, brew.flavor, brew.acidity, brew.aroma, brew.body, brew.sweetness, brew.aftertaste, brew.beans_id, brew.favorite, brew.rating, brew.id]);
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

    // Load brew by brew.id when component renders
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
                            if (mounted) {
                                setBrew(_array[0]);
                                setShowBloom(_array[0].bloom !== "");
                            };
                        }
                    );
                },
                (e) => console.log(e), 
                null
            );
            return () => mounted = false;
        }, [])
    );

    return (
        <View style={{width: "100%", height: "100%"}}>
            <Header title="Edit Brew" leftText="Cancel" rightText="Done" leftOnPress={() => navigation.navigate(parent, { brew_id: brew_id })} rightOnPress={() => updateBrew()}/>
            <KeyboardAwareScrollView style={{...styles.container, backgroundColor: colors.background}} keyboardDismissMode="on-drag">
                <TableView header="Info">
                    <RowItem
                        title="Beans"
                        text=""
                        onPress={() => navigation.navigate("SelectBeans", {beans_id: brew.beans_id, brew_id: brew_id, parent: "EditBrew"})}
                    >   
                        <Text style={{...styles.text, color: colors.placeholder}}>{brew.roaster} - {brew.region}</Text>
                        <Feather name="chevron-right" size={16} color={colors.placeholder}/>
                    </RowItem>
                    <RowItem
                        title="Brew Method"
                        text=""
                        onPress={() => navigation.navigate("BrewMethods", {brew_method: brew.brew_method, brew_id: brew_id, parent: "EditBrew"})}
                    >   
                        <Text style={{...styles.text, color: colors.placeholder}}>{brew.brew_method}</Text>
                        <Feather name="chevron-right" size={16} color={colors.placeholder}/>
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
                <TableView 
                    header="Time"
                    rightChildren={
                        <TouchableOpacity onPress={() => setShowBloom(!showBloom)}>
                            <Feather name={showBloom?"chevron-up":"chevron-down"} size={16} color={colors.placeholder}/>     
                        </TouchableOpacity>
                    }
                >
                    <TextFieldRow title="Brew Time" text={brew.time} onChange={(value) => setBrew({...brew, time: value})}>
                        <Ionicons name="ios-timer-sharp" size={25} color={colors.placeholder} />
                    </TextFieldRow>
                    {showBloom && 
                        <TextFieldRow title="Bloom Time" text={brew.bloom} onChange={(value) => setBrew({...brew, bloom: value})}>
                            <Ionicons name="ios-timer-sharp" size={25} color={colors.placeholder} />
                        </TextFieldRow>
                    }
                </TableView>
                <TableView header="Profile">
                    <SliderRow 
                        title="Flavor"
                        value={brew.flavor}
                        onValueChange={value => setBrew({...brew, flavor: value})}
                        onPress={() => {setModalValues({title: "Flavor", text: flavor}); setShowFlavorModal(true);}}
                    />
                    <SliderRow 
                        title="Acidity"
                        value={brew.acidity}
                        onValueChange={value => setBrew({...brew, acidity: value})}
                        onPress={() => {setModalValues({title: "Acidity", text: acidity}); setShowFlavorModal(true);}}
                    />
                    <SliderRow 
                        title="Aroma"
                        value={brew.aroma}
                        onValueChange={value => setBrew({...brew, aroma: value})}
                        onPress={() => {setModalValues({title: "Aroma", text: aroma}); setShowFlavorModal(true);}}
                    />
                    <SliderRow 
                        title="Body"
                        value={brew.body}
                        onValueChange={value => setBrew({...brew, body: value})}
                        onPress={() => {setModalValues({title: "Body", text: body}); setShowFlavorModal(true);}}
                    />
                    <SliderRow 
                        title="Sweetness"
                        value={brew.sweetness}
                        onValueChange={value => setBrew({...brew, sweetness: value})}
                        onPress={() => {setModalValues({title: "Sweetness", text: sweetness}); setShowFlavorModal(true);}}
                    />
                    <SliderRow 
                        title="Aftertaste"
                        value={brew.aftertaste}
                        onValueChange={value => setBrew({...brew, aftertaste: value})}
                        onPress={() => {setModalValues({title: "Aftertaste", text: aftertaste}); setShowFlavorModal(true);}}
                    />
                </TableView>
                <TableView header="More Info">
                    <TextFieldRow title="Notes" text={brew.notes} onChange={(value) => setBrew({...brew, notes: value})} style={{minHeight: 129, alignItems: 'baseline'}}/>
                </TableView>
                <TableView header="Review">
                    <RatingRow 
                        title="Rating"
                        value={brew.rating}
                        onValueChange={(value) => setBrew({...brew, rating: value})}
                        onPress={() => {setModalValues({title: "Rating", text: overall}); setShowFlavorModal(true);}}
                    />
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
                            <Text style={{color: colors.interactive, fontSize: 16, marginRight: 5}}>{brew.favorite===0?"Favorite":"Unfavorite"}</Text>
                            <FontAwesome name={brew.favorite===1?"heart":"heart-o"} color={colors.interactive} style={{marginLeft: 5}}/>
                        </View>
                    </TouchableOpacity>
                    </View>
                </TableView>
            </KeyboardAwareScrollView>
            <ProfileModal showModal={showFlavorModal} setShowModal={setShowFlavorModal} title={modalValues.title} text={modalValues.text}/>
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