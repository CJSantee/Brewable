import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert
} from 'react-native';
import { SegmentedControl } from 'react-native-ios-kit';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { faChevronRight, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

// Component Imports 
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import RowItem from '../components/RowItem';
import TableView from '../components/TableView';
import TextFieldRow from '../components/TextFieldRow';
import DatePickerRow from '../components/DatePickerRow';
import Header from '../components/Header';

const EditBeans = ({ route, navigation }) => {
    const [beans, setBeans] = useState(route.params.beans); // Retrieve beans data from parent
    const {colors} = useTheme(); // Color theme
    const user_preferences = useSelector(state => state.user_preferences); // User preferences (Redux)

    const missingInfoAlert = () => {
        Alert.alert(
            "Missing Fields",
            "Please enter a Roaster",
            [
                {text: "OK"}
            ]
        )
    }

    // Update Beans Database call
    const updateBeans = () => {
        if (beans.roaster === "") {
            missingInfoAlert();
            return false;
        }
    
        db.transaction(
            (tx) => {
                tx.executeSql(`
                    UPDATE beans
                    SET region = ?, roaster = ?, origin = ?, roast_level = ?, roast_date = ?, price = ?, weight = ?, weight_unit = ?, flavor_notes = ?, favorite = ?
                    WHERE id = ?;`,
                    [beans.region, beans.roaster, beans.origin, beans.roast_level, new Date(beans.roast_date).toJSON(), beans.price, beans.weight, beans.weight_unit, beans.flavor_notes, beans.favorite, beans.id]);
            },
            (e) => {console.log(e)},
            () => navigation.goBack() // Go back on success
        );
    }

    // Delete Beans
    const onDelete = (id) => {
        // Delete from database
        db.transaction(
            (tx) => {
                tx.executeSql(
                `DELETE
                FROM beans
                WHERE id = ?;`,
                [id])
            },
            (e) => console.log(e),
            () => navigation.navigate("HomePage")
        );
    }

    // Delete confirmation prompt
    const deleteConfirmation = () => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to permanently delete these beans? You can’t undo this action.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel")
                },
                {
                    text: "Yes",
                    onPress: () => onDelete(beans.id)
                }
            ]
        )
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
                <TableView header="Flavor">
                    <RowItem
                        title="Flavor Notes"
                        text=""
                        onPress={() => navigation.navigate("SelectFlavors", { parent: "EditBeans", flavor_notes: beans.flavor_notes })}
                    >   
                        <FontAwesomeIcon icon={faChevronRight} size={16} color={colors.placeholder}/>
                    </RowItem>
                    <View style={styles.flavors}>
                        {beans.flavor_notes !== "" ? beans.flavor_notes.split(',').map((item) => 
                            <View key={item} style={{...styles.flavor, backgroundColor: colors.card, borderColor: colors.border}}>
                                <Text style={styles.flavorText}>{item}</Text>
                            </View>
                        ) : <View/>}
                    </View>
                </TableView>
                <TableView>
                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                    <TouchableOpacity onPress={deleteConfirmation} style={{flex: 1}}>
                        <View style={{...styles.bottomButton, backgroundColor: colors.card, borderColor: colors.border}}>
                            <Text style={{color: colors.destructive, fontSize: 16}}>Delete Beans</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setBeans({...beans, favorite: beans.favorite===0?1:0})} style={{flex: 1}}>
                        <View style={{...styles.bottomButton, backgroundColor: colors.card, borderColor: colors.border}}>
                            <Text style={{color: colors.interactive, fontSize: 16, marginRight: 5}}>Favorite Beans</Text>
                            <FontAwesomeIcon icon={beans.favorite===1?faHeartSolid:faHeart} color={colors.interactive} style={{marginLeft: 5}}/>
                        </View>
                    </TouchableOpacity>
                    </View>
                </TableView>
            </ScrollView>
        </View>   
        
    );
}

export default EditBeans;

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