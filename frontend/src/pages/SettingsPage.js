import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { faChevronRight, faFileDownload, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux'
import { updateWaterUnit, updateCoffeeUnit, updateTempUnit, updateRatio, updateTheme, toggleSampleData } from '../redux/PreferenceActions';

// Component Imports
import { SegmentedControl, Stepper } from 'react-native-ios-kit';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Header from '../components/Header';
import TableView from '../components/TableView';
import RowItem from '../components/RowItem';
import { populateBeans, populateRandomBrews } from '../../ DatabaseUtils';

const SettingsPage = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const { colors } = useTheme(); // Color theme
    const dispatch = useDispatch(); // Redux dispatch
    const user_preferences = useSelector(state => state.user_preferences); // User preferences (Redux)
    const sample_data = useSelector(state => state.sample_data);

    const _downloadData = () => {
        if (sample_data) return;
        Alert.alert(
            "Confirm Download",
            "Are you sure you want to download sample data? This will populate your collection with new beans and random brews.",
            [
                {
                    text: "Cancel",
                    onPress: () => {setLoading(false)}
                },
                {
                    text: "Yes",
                    onPress: () => {
                        setLoading(true);
                        populateBeans(db);
                        populateRandomBrews(db, (value) => {setLoading(value); dispatch(toggleSampleData())});
                    }
                }
            ]
        );
    }

    const deleteAll = () => {
        // Delete from database
        db.transaction(
            (tx) => {
                tx.executeSql(
                `DELETE
                FROM beans;`);
            },
            (e) => console.log(e),
            null
        );
    }

    const _confirmDelete = () => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete all beans? This will permanently delete all beans and brews in your collection.",
            [
                {
                    text: "Cancel",
                    onPress: () => {}
                },
                {
                    text: "Yes",
                    onPress: () => {
                        deleteAll();
                    }
                }
            ]
        );
    }

    return (
        <View style={{width: "100%", height: "100%"}}>
            <Header title="Settings" leftText="Back" leftChevron={true} leftOnPress={() => navigation.goBack()}/>
            <ScrollView style={styles.container}>
                <TableView header="Unit Preferences">
                    <RowItem title="Coffee" text="">
                        <SegmentedControl
                            values={['g', 'oz']}
                            selectedIndex={['g','oz'].indexOf(user_preferences.coffee_unit)}
                            onValueChange={(value) => dispatch(updateCoffeeUnit(value))}
                            style={{width: 100}}
                        />
                    </RowItem>
                    <RowItem title="Water" text="">
                        <SegmentedControl
                            values={['g', 'oz', 'ml']}
                            selectedIndex={['g', 'oz', 'ml'].indexOf(user_preferences.water_unit)}
                            onValueChange={(value) => dispatch(updateWaterUnit(value))}
                            style={{width: 100}}
                        />
                    </RowItem>
                    <RowItem title="Temperature" text="">
                        <SegmentedControl
                            values={['f', 'c']}
                            selectedIndex={['f', 'c'].indexOf(user_preferences.temp_unit)}
                            onValueChange={(value) => dispatch(updateTempUnit(value))}
                            style={{width: 100}}
                        />
                    </RowItem>
                </TableView>
                <TableView header="My Data">
                    <RowItem
                        title="Brew Methods"
                        text=""
                        onPress={() => navigation.navigate("BrewMethods", {parent: "SettingsPage"})}
                    >   
                        <FontAwesomeIcon icon={faChevronRight} size={16} color={colors.placeholder}/>
                    </RowItem>
                    <RowItem
                        title="Flavor Notes"
                        text=""
                        onPress={() => navigation.navigate("SelectFlavors", { parent: "SettingsPage", flavor_notes: "" })}
                    >   
                        <FontAwesomeIcon icon={faChevronRight} size={16} color={colors.placeholder}/>
                    </RowItem>
                </TableView>
                <TableView header="Ratio">
                    <RowItem 
                        title={"1 : "+user_preferences.ratio} text=""
                    >
                        <Stepper
                            value={user_preferences.ratio}
                            onValueChange={(value) => dispatch(updateRatio(value))}
                            minValue={1}
                            maxValue={100}
                        />
                    </RowItem>
                </TableView>
                <TableView header="App">
                    <RowItem
                        title="Theme" text=""
                    >
                        <SegmentedControl
                            values={['Light', 'Dark']}
                            selectedIndex={['Light', 'Dark'].indexOf(user_preferences.theme)}
                            onValueChange={(value) => dispatch(updateTheme(value))}
                            style={{width: 150}}
                        />
                    </RowItem>
                    <RowItem title="Download Sample Data" text="" onPress={_downloadData}>
                        {loading?
                        <ActivityIndicator size="small"/> 
                        :sample_data?
                            <FontAwesomeIcon icon={faCheck} size={20} color={colors.placeholder}/>
                            :<FontAwesomeIcon icon={faFileDownload} size={20} color={colors.placeholder}/>}
                    </RowItem>
                    <RowItem title="Delete All Beans" text="" onPress={_confirmDelete}>
                        
                    </RowItem>
                </TableView>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
    }
});

export default SettingsPage;