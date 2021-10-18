import React, { useCallback, useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList
} from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import RowItem from './components/RowItem';
import Header from './components/Header';

const BrewMethods = ({ route, navigation }) => {
    const { brew_method, parent } = route.params; // Selected brew_method and parent navigation page
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
                plus={true} plusOnPress={() => navigation.navigate("NewBrewMethod")}
            />
            <FlatList 
                data={methods}
                renderItem={(object) => 
                    <RowItem 
                        title={object.item.method} text=""
                        onPress={
                            (brew_method!=="none")?
                            () => { navigation.navigate(parent, {brew_method: object.item.method})}:null
                        }
                        showSelect={editing}
                        selected={selected.has(object.item.method)}
                        toggleSelect={(value) => toggleSelected(value)}
                    >
                        {brew_method === item.item.method ? <FontAwesomeIcon icon={faCheck} size={20} color={colors.placeholder}/> : <View/>}
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