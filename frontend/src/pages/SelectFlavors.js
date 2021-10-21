import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Alert
} from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

// Component Imports 
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import RowItem from '../components/RowItem';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';

const SelectFlavors = ({ route, navigation }) => {
    const [flavors, setFlavors] = useState([]); // Array of brew methods
    const { parent } = route.params; // Selected brew_method and parent navigation page
    const { colors } = useTheme(); // Color theme
    const [editing, setEditing]= useState(false); // Selecting methods to delete
    const [selected, setSelected] = useState(new Set()); // Set of currently selected brew_methods
    const [picked, setPicked] = useState(new Set()); // Set of the flavors picked for beans

    // Search state variables
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [sortBy, setSortBy] = useState("flavor"); // other ideas: add flavor popularity to database and sort by that

    // Filter search queries by flavor name
    function searchFilter(item, query) {
        query = query.toLowerCase();
        if (item.flavor.toLowerCase().includes(query)) {
            return true;
        }
        return false;
    }

    // Update search query state and filter results
    function handleSearch(newSearchQuery) {
        setSearchQuery(newSearchQuery);
        setSearchResults(flavors.filter(item => searchFilter(item, newSearchQuery) ));
    }

    // Compare function for sorting flavors
    const compare = useCallback(
        (a, b) => {
            if (sortBy === "flavor")
                return a.flavor.localeCompare(b.flavor);
            return a - b;
        },
        [sortBy]
    );

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

    // Prompt User to Enter New Flavor
    const newFlavorPrompt = () => {
        Alert.prompt(
            "New Flavor",
            "Enter new flavor name",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel")
                },
                {
                    text: "Done",
                    onPress: (value) => addFlavor(value)
                }
            ]
        );
    }

    // Convert set of picked flavors to comma-separated values
    function flavorNotes() {
        if (picked.size === 0)
            return "";
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
                selected.forEach((value) => { // BUG: Deleted items are still picked
                    if (picked.has(value)) // If values being deleted are picked, unpick them -> Still not working
                        togglePicked(value);
                });
                toggleEditing(); // On success, stop editing
                updateFlavors(); // Update the flavors list
            } 
        );
    }

    // Add flavor to database
    const addFlavor = (flavor) => {
        if (flavor === "") {
            console.log("Missing Value");
            return false;
        }
    
        db.transaction(
            (tx) => {
                tx.executeSql(`
                    INSERT INTO flavors
                    (flavor)
                    VALUES (?);`,
                    [flavor]
                );
            },
            (e) => {console.log(e)},
            updateFlavors
        );
    }

    // Load the flavors from the database
    const updateFlavors = useCallback(() => {
        let mounted = true;
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM flavors;",
                [],
                (_, { rows: { _array } }) => {
                if (mounted) {
                    setFlavors(_array.sort(compare));
                }
            });
        },
        (e) => console.log(e),
        null);
        return () => mounted = false;
    },[]);

    // Retrieve the array of brew methods from database when component is mounted
    useFocusEffect(updateFlavors);

    // Second useEffect without dependencies so only run once on render
    useEffect(() => {
        if (route.params?.flavor_notes) { // If parent provides flavor_notes, update beans.flavor_notes
            setPicked(new Set(route.params?.flavor_notes.split(',')));
        }
    },[])

    return (
        <View style={{height: "100%", width: "100%"}}>  
            <Header 
                title="Flavors" 
                leftText={editing?"Delete":"Back"}
                rightText={editing?"Done":"Edit"}
                leftOnPress={editing?deleteSelected:() => navigation.navigate(parent, { flavor_notes: flavorNotes() })} 
                leftChevron={editing?false:true}  
                rightOnPress={toggleEditing}
                plus={true} plusOnPress={newFlavorPrompt}
            />
            <SearchBar searchQuery={searchQuery} setSearchQuery={handleSearch}/> 
            <FlatList 
                data={searchQuery===""?flavors:searchResults}
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