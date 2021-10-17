import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

// Component Imports 
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import RowItem from './components/RowItem';
import Header from './components/Header';

// Open SQLite Database
function openDatabase() {
    const db = SQLite.openDatabase("CoffeeLab.db");
    return db;
}
  
const db = openDatabase();

const SelectFlavors = ({ route, navigation }) => {
    const [flavors, setFlavors] = useState([]); // Array of brew methods
    const { parent } = route.params; // Selected brew_method and parent navigation page
    const { colors } = useTheme(); // Color theme
    const [editing, setEditing]= useState(false); // Selecting methods to delete
    const [selected, setSelected] = useState(new Set()); // Set of currently selected brew_methods
    const [picked, setPicked] = useState(new Set()); // Set of the flavors picked for beans

    // Toggle editing and clear selected
    function toggleEditing() {
        setEditing(!editing);
        setSelected(new Set());
    }

    // Add or remove element from set of selected flavors
    function toggleSelected(value) {
        if (selected.has(value)) {
            let newSet = new Set(selected);
            newSet.delete(value);
            setSelected(newSet);
        } else {
            let newSet = new Set(selected);
            newSet.add(value);
            setSelected(newSet);
        }
    }

    // Add or remove element from set of picked flavors
    function togglePicked(value) {
        if (picked.has(value)) {
            let newSet = new Set(picked);
            newSet.delete(value);
            setPicked(newSet);
        } else {
            let newSet = new Set(picked);
            newSet.add(value);
            setPicked(newSet);
        }
    }

    // Convert set of picked flavors to comma-separated values
    function flavorNotes() {
        let flavor_notes = "";
        picked.forEach(item => flavor_notes+=(item+","));
        return flavor_notes.substring(0, flavor_notes.length-1);
    }

    // Remove each of the elements in the selected set from the database
    const deleteSelected = () => {
        db.transaction(
            (tx) => {
                selected.forEach((value) => 
                    tx.executeSql("DELETE FROM flavors WHERE flavor = ?;", [value])
                );
            },
            (e) => console.log(e),
            () => {
                selected.forEach((value) => {
                    if (picked.has(value)) // If values being deleted are picked, unpick them
                        togglePicked(value);
                });
                toggleEditing(); // On success, stop editing
            } 
        );
    }
    
    useEffect(() => {
        if (route.params?.flavor_notes) { // If parent provides flavor_notes, update beans.flavor_notes
            setPicked(new Set(route.params?.flavor_notes.split(',')));
        }
    },[])

    // Retrieve the array of brew methods from database when component is mounted
    useEffect(() => {
        let mounted = true;
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM flavors;",
                [],
                (_, { rows: { _array } }) => {
                if (mounted) {
                    setFlavors(_array);
                }
            });
        },
        (e) => console.log(e),
        null);
        return () => mounted = false;
    },[flavors]);

    return (
        <View style={{height: "100%", width: "100%"}}>  
            <Header 
                title="Flavors" 
                leftText={editing?"Delete":"Back"}
                rightText={editing?"Done":"Edit"}
                leftOnPress={editing?deleteSelected:() => navigation.navigate(parent, { flavor_notes: flavorNotes() })} 
                leftChevron={editing?false:true}  
                rightOnPress={toggleEditing}
                plus={true} plusOnPress={() => navigation.navigate("NewFlavor")}
            />
            <FlatList 
                data={flavors}
                renderItem={(item) => 
                    <RowItem 
                        title={item.item.flavor} text=""
                        onPress={() => togglePicked(item.item.flavor)}
                        showSelect={editing}
                        selected={selected.has(item.item.flavor)}
                        toggleSelect={(value) => toggleSelected(value)}
                    >
                        {picked.has(item.item.flavor)?<FontAwesomeIcon icon={faCheck} size={20} color={colors.placeholder}/> : <View/>}
                    </RowItem>  
                }
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}

export default SelectFlavors;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
    }
});