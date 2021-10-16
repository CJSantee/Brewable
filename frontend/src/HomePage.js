import React, { useCallback, useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import BrewList from './BrewList';
import Header from './components/Header';
import RowItem from './components/RowItem';
import SearchBar from './components/SearchBar';

function openDatabase() {
    const db = SQLite.openDatabase("CoffeeLab.db");
    return db;
}
  
const db = openDatabase();

const Modal = ({ navigation }) => {
    const {colors} = useTheme();
    return (
        <View style={styles.modal}>
            <RowItem title="Beans" text="" onPress={() => navigation.navigate("New Beans")}>
                <FontAwesomeIcon icon={faChevronRight} size={20} color={colors.interactive}/>
            </RowItem>
            <RowItem title="Brew" text="" onPress={() => navigation.navigate("New Brew")}>
                <FontAwesomeIcon icon={faChevronRight} size={20} color={colors.interactive}/>
            </RowItem>
        </View>
    );
}

const HomePage = ({ navigation }) => {
    const {colors} = useTheme(); // Theme colors
    const [modal, setModal] = useState(false); // Modal state
    const [beans, setBeans] = useState([]); // Beans array

    // Search state variables
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [sortBy, setSortBy] = useState("roaster");

    // Filter search queries by roaster and region
    function searchFilter(item, query) {
        query = query.toLowerCase();
        if (item.roaster.toLowerCase().includes(query))
            return true;
        if (item.region.toLowerCase().includes(query))
            return true;
        return false;        
    }

    // Update search query state and filter results
    function handleSearch(newSearchQuery) {
        setSearchQuery(newSearchQuery);
        setSearchResults(beans.filter(item => searchFilter(item, newSearchQuery) ));
    }

    // Compare function for sorting beans
    const compare = useCallback(
        (a, b) => {
            if (sortBy === "roaster")
                return a.roaster.localeCompare(b.roaster);
            return a - b;
        },
        [sortBy]
    );

    useFocusEffect(
        useCallback(()=> {
            let mounted = true;
            setModal(false);
            db.transaction((tx) => {
                tx.executeSql("SELECT * FROM beans;",
                [],
                (_, { rows: { _array } }) => {
                    if (mounted) setBeans(_array.sort(compare))
                });
            });
            return () => mounted = false;
        }, [])
    );

    return (
        <View style={{flex: 1, flexDirection: 'column', backgroundColor: colors.background}}>
            <Header title="Brews" leftText="Settings" rightText="New" leftOnPress={()=>navigation.navigate("Profile")} rightOnPress={()=>setModal(!modal)}/>
            {modal ? <Modal navigation={navigation}/> : <View/>}
            {modal ? <View/> : <SearchBar searchQuery={searchQuery} setSearchQuery={handleSearch}/>}
            {beans === null || beans.length === 0 ? <View/> : 
            <FlatList 
                data={searchQuery===""?beans:searchResults}
                renderItem={(object) => <BrewList beans={object.item} navigation={navigation}/>}
                keyExtractor={item => item.id.toString()}
            />}
        </View>
    );
}

export default HomePage;

const styles = StyleSheet.create({
    modal: {
        zIndex: 1,
        borderColor: "rgb(201, 210, 217)",
        borderBottomWidth: 1
    },
    text: {
        fontSize: 18,
    }
});