import React, { useState, useCallback } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
    Text
} from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux'
import { updateSampleData } from '../redux/PreferenceActions';

// Component Imports
import Header from '../components/Header';
import TableView from '../components/TableView';
import RowItem from '../components/RowItem';
import { populateBeans, populateRandomBrews } from '../../ DatabaseUtils';

const DeveloperPage = ({ navigation }) => {
    const [numBeans, setNumBeans] = useState(0);
    const [numBrews, setNumBrews] = useState(0);
    const [loading, setLoading] = useState(false);
    const { colors } = useTheme(); // Color theme
    const dispatch = useDispatch(); // Redux dispatch
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
                        populateRandomBrews(db, (value) => {setLoading(value); dispatch(updateSampleData(true));});
                        onRefresh(true);
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
                tx.executeSql(
                    `DELETE
                    FROM brews;`);
            },
            (e) => console.log(e),
            () => {
                onRefresh(true);
                dispatch(updateSampleData(false));
            }
        );
    }

    const _confirmDelete = () => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete all beans and brews? This action is permanent and cannot be undone.",
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

    function onRefresh(mounted) {
        db.transaction(
            (tx) => {
                tx.executeSql(
                    `SELECT count(*) AS count
                    FROM beans`,
                    [],
                    (_, { rows: { _array } }) => {
                        if (mounted) {
                            setNumBeans(_array[0].count);
                        };
                    }
                );
                tx.executeSql(
                    `SELECT count(*) AS count
                    FROM brews`,
                    [],
                    (_, { rows: { _array } }) => {
                        if (mounted) {
                            setNumBrews(_array[0].count);
                        };
                    }
                );                        
            },
            (e) => console.log(e), null
        );
    }

    useFocusEffect(
        useCallback(() => {
            let mounted = true;
            onRefresh(mounted);
            return () => mounted = false;
        }, [])
    );

    return (
        <View style={{width: "100%", height: "100%"}}>
            <Header title="Partners" leftText="Back" leftChevron={true} leftOnPress={() => navigation.goBack()}/>
            <ScrollView style={styles.container}>
                <TableView header="App">
                    <RowItem title="Download Sample Data" text="" onPress={_downloadData}>
                        {loading?
                        <ActivityIndicator size="small"/> 
                        :sample_data?
                            <Feather name="check" size={20} color={colors.placeholder}/>
                            :<Feather name="download" size={20} color={colors.placeholder}/>}
                    </RowItem>
                    <RowItem title="Delete All Beans" text="" onPress={_confirmDelete}>
                            <Feather name="trash-2" size={20} color={colors.destructive}/>
                    </RowItem>
                    <RowItem title="Beans" text="">
                        <Text style={{color: colors.text}}>{numBeans}</Text>
                    </RowItem>
                    <RowItem title="Brews" text="">
                        <Text style={{color: colors.text}}>{numBrews}</Text>
                    </RowItem>
                </TableView>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        marginBottom: 25
    }
});

export default DeveloperPage;