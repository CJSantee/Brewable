import React, { useCallback, useEffect, useState } from 'react';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import {
    View,
    FlatList
} from 'react-native';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

// Component Imports
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Header from '../components/Header';
import RowItem from '../components/RowItem';

const SelectBeans = ({ navigation, route }) => {
    const [beans, setBeans] = useState([]); // List of beans
    const { beans_id, brew_id, parent } = route.params; // Beans_id and parent page
    const { colors } = useTheme(); // Color theme

    const updateBrew = (_beans_id) => {
        db.transaction(
            (tx) => {
                tx.executeSql("UPDATE brews SET beans_id = ? WHERE id = ?;", [_beans_id, brew_id]);
            },
            (e) => console.log(e),
            () => navigation.navigate(parent, { brew_id: brew_id })
        );
    }

    // Retrieve list of beans when component is mounted
    useFocusEffect(
        useCallback(() => {
            let mounted = true;
            db.transaction(
                (tx) => {
                    tx.executeSql("SELECT * FROM beans;",
                    [],
                    (_, { rows: { _array } }) => {
                        if (mounted) setBeans(_array);
                    }
                );
            });
            return () => mounted = false;
        }, [])
    );

    return (
        <View style={{height: "100%", width: "100%"}}>
            <Header title="Select Beans" leftText="Back" leftOnPress={() => navigation.goBack()} leftChevron={true}/>
            <FlatList 
                data={beans}
                renderItem={({item}) => 
                    <RowItem 
                        title={item.roaster + " - " + item.region} 
                        text=""
                        onPress={() => updateBrew(item.id)}>
                        {beans_id === item.id ? <FontAwesomeIcon icon={faCheck} size={20} color={colors.placeholder}/> : <View/>}
                    </RowItem>}
                keyExtractor={item => item.id.toString()}
            />
        </View>
        
    );
}

export default SelectBeans;
