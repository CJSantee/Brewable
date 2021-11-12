import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert
} from 'react-native';
import { Feather, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { acidity, aftertaste, aroma, body, flavor, overall, sweetness } from '../utils/Descriptions';

// Component Imports 
import { SegmentedControl } from 'react-native-ios-kit';
import Header from '../components/Header';
import TableView from '../components/TableView';
import RowItem from '../components/RowItem';
import TextFieldRow from '../components/TextFieldRow';
import SliderRow from '../components/SliderRow';
import DatePickerRow from '../components/DatePickerRow';
import ProfileModal from '../components/ProfileModal';
import RatingRow from '../components/RatingRow';

const NewBrew = ({ route, navigation }) => {
    const [brew, setBrew] = useState(
        {
            brew_method: "", 
            grind_setting: "", 
            coffee: 0, coffee_unit: "g", 
            water: 0, water_unit: "g", 
            temperature: 0, temp_unit: "f", 
            time: "",
            bloom: "",
            flavor: 0, acidity: 0, aroma: 0, body: 0, sweetness: 0, aftertaste: 0, 
            notes: "", 
            date: new Date(), 
            beans_id: 0, 
            rating: 0,
            favorite: 0
        }
    ); // Brew state
    const { colors } = useTheme(); // Color theme
    
    // Brew Timer Sate
    const [brewTimer, setBrewTimer] = useState(0); // Current timer value in seconds
    const [usingBrewTimer, setUsingBrewTimer] = useState(false);
    const [brewTimerIsActive, setBrewTimerIsActive] = useState(false); // Timer isActive?
    const brewCountRef = useRef(null); // Counter

    // Bloom Timer State
    const [bloomTimer, setBloomTimer] = useState(0);
    const [usingBloomTimer, setUsingBloomTimer] = useState(false);
    const [bloomTimerIsActive, setBloomTimerIsActive] = useState(false);
    const bloomCountRef = useRef(null); // Counter

    const [showBloom, setShowBloom] = useState(false);

    // Flavor Modal 
    const [showFlavorModal, setShowFlavorModal] = useState(false);
    const [modalValues, setModalValues] = useState({title: "", text: ""});

    const user_preferences = useSelector(state => state.user_preferences); // User preferences (Redux)

    const missingInfoAlert = () => {
        Alert.alert(
            "Missing Fields",
            "Please select Beans and Brew Method",
            [
                {text: "OK"}
            ]
        )
    }
    
    // Add brew to database
    const addBrew = () => {
        if (brew.beans_id === "" || brew.brew_method === "") {
            missingInfoAlert();
            return false;
        }
    
        db.transaction(
            (tx) => {
                tx.executeSql(`
                    INSERT INTO brews
                    (grind_setting, water, water_unit, coffee, coffee_unit, temperature, temp_unit, brew_method, time, bloom, date, notes, flavor, acidity, aroma, body, sweetness, aftertaste, beans_id, favorite, rating)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                    [brew.grind_setting, brew.water, brew.water_unit, brew.coffee, brew.coffee_unit, brew.temperature, brew.temp_unit, brew.brew_method, usingBrewTimer?formatTime(brewTimer):brew.time, usingBloomTimer?formatTime(bloomTimer):brew.bloom, brew.date.toJSON(), brew.notes, brew.flavor, brew.acidity, brew.aroma, brew.body, brew.sweetness, brew.aftertaste, brew.beans_id, brew.favorite, brew.rating]);
            },
            (e) => {console.log(e)},
            () => navigation.goBack()
        );
    }

    // Start / Stop Brew Timer
    const toggleBrewTimer = () => {
        setUsingBrewTimer(true);
        if (!brewTimerIsActive) {
            setBrewTimerIsActive(true);
            brewCountRef.current = setInterval(() => {
                setBrewTimer((timer) => timer + 1);
            }, 1000);
        } else {
            clearInterval(brewCountRef.current);
            setBrewTimerIsActive(false);
        }
    }

    // Start / Stop Bloom Timer
    const toggleBloomTimer = () => {
        setUsingBloomTimer(true);
        if (!bloomTimerIsActive) {
            setBloomTimerIsActive(true);
            bloomCountRef.current = setInterval(() => {
                setBloomTimer((timer) => timer + 1);
            }, 1000);
        } else {
            clearInterval(bloomCountRef.current);
            setBloomTimerIsActive(false);
        }
    }

    // Return formatted time
    const formatTime = (timer) => {
        // Map values to minutes and seconds
        const getSeconds = `0${(timer % 60)}`.slice(-2);
        const minutes = `${Math.floor(timer / 60)}`;
        const getMinutes = `0${minutes % 60}`.slice(-2);   
        return `${getMinutes}:${getSeconds}`;
    }

    useEffect(() => {
        if (route.params?.brew) { // For suggest brew
            setBrew({...route.params.brew, rating: 0, date: new Date(), time: "00:00", favorite: 0});
        }
        if (route.params?.brew_method) { // If parent provides brew_method, update brew.brew_method
            setBrew({...brew, brew_method: route.params.brew_method});
        }
        if (route.params?.beans_id) { // If parent provides beans info update beans
            setBrew({...brew, roaster: route.params.roaster, region: route.params.region, beans_id: route.params.beans_id});
        }
    }, [route.params?.brew_method, route.params?.beans_id]);

    return (
        <View style={{width: "100%", height: "100%"}}>
            <Header title="New Brew" leftText="Cancel" rightText="Done" leftOnPress={() => navigation.goBack()} rightOnPress={() => addBrew()}/>

            <KeyboardAwareScrollView style={{...styles.container, backgroundColor: colors.background}} keyboardDismissMode="on-drag">
                <TableView header="Info">
                    <RowItem
                        title="Beans"
                        text=""
                        onPress={() => navigation.navigate("SelectBeans", {beans_id: brew.beans_id, parent: "NewBrew"})}
                    >   
                        <Text style={{...styles.text, color: colors.placeholder}}>{brew.roaster} - {brew.region}</Text>
                        <Feather name="chevron-right" size={16} color={colors.placeholder}/>
                    </RowItem>
                    <RowItem
                        title="Brew Method"
                        text=""
                        onPress={() => navigation.navigate("BrewMethods", {brew_method: brew.brew_method, parent: "NewBrew"})}
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
                        keyboardType="decimal-pad"
                    />
                    <TextFieldRow
                        title="Coffee Amount"
                        text={brew.coffee}
                        onChange={(value) => setBrew({...brew, coffee: value, water: user_preferences.autofill_ratio?value*user_preferences.ratio:brew.water})}
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
                            selectedIndex={['f','c'].indexOf(user_preferences.temp_unit)}
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
                    <TextFieldRow title="Brew Time" text={usingBrewTimer?formatTime(brewTimer):brew.time} onChange={(value) => {setUsingBrewTimer(false); setBrew({...brew, time: value})}}>
                        <Ionicons name="ios-timer-sharp" size={25} color={brewTimerIsActive ? "#a00" : colors.interactive} onPress={toggleBrewTimer}/>
                    </TextFieldRow>
                    {showBloom && 
                        <TextFieldRow title="Bloom Time" text={usingBloomTimer?formatTime(bloomTimer):brew.bloom} onChange={(value) => {setUsingBloomTimer(false); setBrew({...brew, bloom: value})}}>
                            <Ionicons name="ios-timer-sharp" size={25} color={bloomTimerIsActive ? "#a00" : colors.interactive} onPress={toggleBloomTimer}/>
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
                        onPress={() => {setModalValues({title: "Acidty", text: acidity}); setShowFlavorModal(true);}}
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
                    <TextFieldRow title="Notes" text={brew.notes} onChange={(value) => setBrew({...brew, notes: value})} style={{minHeight: 129, alignItems: 'baseline', flexWrap: 'wrap'}}/>
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
                    <TouchableOpacity onPress={() => setBrew({...brew, favorite: brew.favorite===0?1:0})} style={{flex: 1}}>
                        <View style={{...styles.bottomButton, backgroundColor: colors.card, borderColor: colors.border}}>
                            <Text style={{color: colors.interactive, fontSize: 16, marginRight: 5}}>Favorite Brew</Text>
                            <FontAwesome name={brew.favorite===1?"heart":"heart-o"} color={colors.interactive}/>
                        </View>
                    </TouchableOpacity>
                </TableView>
            </KeyboardAwareScrollView>

            <ProfileModal showModal={showFlavorModal} setShowModal={setShowFlavorModal} title={modalValues.title} text={modalValues.text}/>
        </View>
    );
}

export default NewBrew;

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