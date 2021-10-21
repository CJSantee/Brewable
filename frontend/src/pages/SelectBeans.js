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

const SelectBeans = ({ route, navigation }) => {
    const [beans, setBeans] = useState([]); // List of beans
    const { beans_id, parent } = route.params; // Beans_id and parent page
    const { colors } = useTheme(); // Color theme

    // Retrieve list of beans when component is mounted
    useFocusEffect(
        useCallback(()=> {
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
                renderItem={(item) => 
                    <RowItem 
                        title={item.item.roaster + " - " + item.item.region} 
                        text=""
                        onPress={() => { navigation.navigate(parent, {roaster: item.item.roaster, region: item.item.region, beans_id: item.item.id}); }}>
                        {beans_id === item.item.id ? <FontAwesomeIcon icon={faCheck} size={20} color={colors.placeholder}/> : <View/>}
                    </RowItem>}
                keyExtractor={item => item.id.toString()}
            />
        </View>
        
    );
}

export default SelectBeans;
