import React, { useCallback, useState } from 'react';
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

const BrewMethods = ({ route, navigation }) => {
    const { brew_method, brew_id, parent } = route.params; // Selected brew_method and parent navigation page
    const { colors } = useTheme(); // Color theme

    // State Variables
    const [methods, setMethods] = useState([]); // Array of brew methods
    const [editing, setEditing]= useState(false); // Selecting methods to delete
    const [selected, setSelected] = useState(new Set()); // Set of currently selected brew_methods

    // Toggle editing and clear selected
    function toggleEditing() {
        setEditing(!editing);
        setSelected(new Set());
    }

    // Add or remove element from set of selected methods
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

    // Prompt user to enter new brew method
    const newBrewMethodPrompt = () => {
        Alert.prompt(
            "Add Brew Method",
            "Enter new brew method name",
            [
                {
                    text: "Cancel",
                    onPress: () => {}
                },
                {
                    text: "Done",
                    onPress: (value) => addBrewMethod(value)
                }
            ]
        );
    }

    // Remove each of the elements in the selected set from the database
    const deleteSelected = () => {
        db.transaction(
            (tx) => {
                selected.forEach((value) => 
                    tx.executeSql("DELETE FROM brew_methods WHERE method = ?;", [value])
                );
            },
            (e) => console.log(e),
            () => {
                toggleEditing(); // On success, stop editing
                updateBrewMethods();
            }
        );
    }

    const updateBrew = (_brew_method) => {
        db.transaction(
            (tx) => {
                tx.executeSql("UPDATE brews SET brew_method = ? WHERE id = ?;", [_brew_method, brew_id]);
            },
            (e) => console.log(e),
            () => navigation.navigate(parent, { brew_id: brew_id })
        );
    }

    // Add method to database
    const addBrewMethod = (method) => {
        if (method === "") {
            console.log("Missing Value");
            return false;
        }
    
        db.transaction(
            (tx) => {
                tx.executeSql(`
                    INSERT INTO brew_methods
                    (method)
                    VALUES (?);`,
                    [method]
                );
            },
            (e) => {console.log(e)},
            updateBrewMethods
        );
    }

    // Load brew methods from database
    const updateBrewMethods = useCallback(() => {
        let mounted = true;
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM brew_methods;",
                [],
                (_, { rows: { _array } }) => {
                if (mounted) {
                    setMethods(_array);
                }
            });
        },
        (e) => console.log(e),
        null);
        return () => mounted = false;
    },[]);

    // Retrieve the array of brew methods from database when component is mounted
    useFocusEffect(updateBrewMethods);

    return (
        <View style={{height: "100%", width: "100%"}}>  
            <Header 
                title="Brew Method" 
                leftText={editing?"Delete":"Back"}
                rightText={editing?"Done":"Edit"}
                leftOnPress={editing?deleteSelected:() => navigation.goBack()} 
                leftChevron={editing?false:true}  
                rightOnPress={toggleEditing}
                plus={true} plusOnPress={newBrewMethodPrompt}
            />
            <FlatList 
                data={methods}
                renderItem={({item}) => 
                    <RowItem 
                        title={item.method} text=""
                        onPress={
                            parent==="EditBrew"?
                            () => updateBrew(item.method):() => navigation.navigate(parent, {brew_method: item.method})
                        }
                        showSelect={editing}
                        selected={selected.has(item.method)}
                        toggleSelect={(value) => toggleSelected(value)}
                    >
                        {brew_method === item.method ? <FontAwesomeIcon icon={faCheck} size={20} color={colors.placeholder}/> : <View/>}
                    </RowItem>  
                }
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}

export default BrewMethods;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
    }
});