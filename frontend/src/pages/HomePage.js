import React, { useCallback, useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
    Alert
} from 'react-native';

import { Feather, FontAwesome } from '@expo/vector-icons';

import { useTheme, useFocusEffect } from '@react-navigation/native';

import * as Clipboard from 'expo-clipboard';

import { toBeansString } from '../utils/Converter';

/*
    TODO: Add Confirmation for Copy to Clipboard
*/

// Component Imports
import { SegmentedControl } from 'react-native-ios-kit';
import Header from '../components/Header';
import RowItem from '../components/RowItem';
import SearchBar from '../components/SearchBar';
import Icon from '../components/Icon';
import FullScreenModal from '../components/FullScreenModal';

// Modal for listing new beans or brew
const NewModal = ({ navigation }) => {
    const {colors} = useTheme();

    return (
        <View style={{...styles.newModal, borderColor: colors.border}}>
            <RowItem title="Beans" text="" onPress={() => navigation.navigate("NewBeans")}>
                <Feather name="chevron-right" size={20} color={colors.interactive}/>
            </RowItem>
            <RowItem title="Brew" text="" onPress={() => navigation.navigate("NewBrew")}>
                <Feather name="chevron-right" size={20} color={colors.interactive}/>
            </RowItem>
        </View>
    );
}

const Beans = ({beans, onLongPress, navigation}) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity 
            onPress={() => navigation.navigate("DisplayBeans", {beans_id: beans.id, parent: "HomePage"})}
            onLongPress={onLongPress}
        >
            <View style={{...styles.beansRow, borderColor: colors.border}}> 
                <Icon uri={beans.photo_uri} size={80}/>
                <View style={{flexDirection: 'column', margin: 15}}>
                    <Text style={{fontWeight: 'bold', fontSize: 18, color: colors.text}}>{beans.roaster}</Text>
                    <Text style={{fontSize: 16, color: colors.text}}>{beans.name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const HomePage = ({ navigation }) => {
    const { colors } = useTheme(); // Theme colors
    const [newModal, setNewModal] = useState(false); // New Modal state
    const [btmModal, setBtmModal] = useState(false); // Bottom modal state
    const [selected, setSelected] = useState({});
    const [beans, setBeans] = useState([]); // Beans array
    const [refreshing, setRefreshing] = useState(false);

    const ref_flatlist = useRef();

    // Search state variables
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [sortBy, setSortBy] = useState("roast_date");

    // Filter search queries by roaster and name
    function searchFilter(item, query) {
        query = query.toLowerCase();
        if (item.roaster.toLowerCase().includes(query))
            return true;
        if (item.name.toLowerCase().includes(query))
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
            if (sortBy === "alphabetical")
                return a.roaster.localeCompare(b.roaster, 'en');
            if (sortBy === "roast_date") {
                a = new Date(a.roast_date).setHours(0,0,0,0);
                b = new Date(b.roast_date).setHours(0,0,0,0);
                if (a < b) return 1;
                if (a > b) return -1;
                return 0;
            }
            return a - b;
        },
        [sortBy]
    );

    // Set Brew as Favorite
    const onFavorite = (id) => {
        let val = 0;
        beans.forEach(beans => {if (beans.id === id) val = beans.favorite});
        // Update brew in database
        db.transaction(
            (tx) => {
                tx.executeSql("UPDATE beans SET favorite = ? WHERE id = ?;", [val===0?1:0, id])
            }, 
            (e) => console.log(e), 
            null
        );
        // Update brew state within component
        setBeans(beans.map(beans => (beans.id === id ? {...beans, favorite: val===0?1:0}:beans)));
        setSelected({...selected, favorite: val===0?1:0})
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
            () => {
                onRefresh();
                setBtmModal(false);
                setSelected({});
            }
        );
    }

    const deleteConfirmation = () => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to permanently delete these beans? You can’t undo this action.",
            [
                {
                    text: "Cancel",
                    onPress: () => {}
                },
                {
                    text: "Yes",
                    onPress: () => onDelete(selected.id)
                }
            ]
        );
    }

    const onRefresh = () => {
        setRefreshing(true);
        db.transaction(
            (tx) => {
                tx.executeSql(
                    "SELECT * FROM beans;",
                    [],
                    (_, { rows: { _array } }) => {
                        setBeans(_array.sort(compare));
                    }
                );
            },
            (e) => console.log(e),
            () => setRefreshing(false)
        );
    }

    // Retrieve list of beans when component mounts
    useFocusEffect(
        useCallback(()=> {
            let mounted = true;
            setNewModal(false);
            setBtmModal(false);
            setRefreshing(true);
            db.transaction((tx) => {
                tx.executeSql("SELECT * FROM beans;",
                [],
                (_, { rows: { _array } }) => {
                    if (mounted) setBeans(_array.sort(compare));
                });
            },
            (e) => console.log(e),
            () => setRefreshing(false));
            return () => mounted = false;
        }, [])
    );

    const renderItem = useCallback(
        ({item, index}) => <Beans beans={item} onDelete={onDelete} onLongPress={() => {setSelected(item); setBtmModal(true);}} navigation={navigation}/>,
        []
    );

    const keyExtractor = useCallback((item) => item.id.toString(), []);

    return (
        <View style={{flex: 1, flexDirection: 'column', backgroundColor: colors.background}}>
            <Header title="My Collection" leftText="Settings" rightText="New" leftOnPress={()=>navigation.navigate("SettingsPage")} rightOnPress={()=>setNewModal(!newModal)}/>
            {newModal ? <NewModal navigation={navigation}/> : <View/>}
            {newModal ? null : <SearchBar searchQuery={searchQuery} setSearchQuery={handleSearch}/>}
            {newModal ? null : 
            <View style={{backgroundColor: colors.card, borderBottomWidth: 1, borderColor: colors.border}}>
                <SegmentedControl
                    values={['Roast Date', 'Alphabetical']}
                    selectedIndex={0}
                    onValueChange={(value, index) => {
                        if (index === 0) {
                            setSortBy("roast_date");
                        } else {
                            setSortBy("alphabetical");
                        }
                    }}
                    style={{marginHorizontal: 10, marginBottom: 10}}
                />
            </View>}
            {beans.length === 0 ? 
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: colors.placeholder, fontSize: 18}}>No Beans</Text>
            </View> : 
            <FlatList 
                ref={ref_flatlist}
                data={searchQuery===""?beans:searchResults}
                renderItem={renderItem}
                maxToRenderPerBatch={6}
                initialNumToRender={3}
                keyExtractor={keyExtractor}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />}
            {btmModal && 
            <FullScreenModal colors={colors} close={() => setBtmModal(false)}>
                <TouchableOpacity onPress={() => navigation.navigate("EditBeans", { beans_id: selected.id, flavor_notes: selected.flavor_notes })}>
                    <View style={styles.menuItem}>
                        <Feather name="edit" size={22} color={colors.text}/>
                        <Text style={{...styles.menuText, color: colors.text}}>Edit</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("DisplayBeans", {beans_id: selected.id, parent: "HomePage", share: true})}>
                    <View style={styles.menuItem}>
                        <Feather name="share" size={22} color={colors.text}/>
                        <Text style={{...styles.menuText, color: colors.text}}>Share</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("NewBrew", { beans_id: selected.id, roaster: selected.roaster, name: selected.name })}>
                    <View style={{...styles.menuItem, borderBottomWidth: 1.5, borderColor: colors.border}}>
                        <Feather name="coffee" size={22} color={colors.text}/>
                        <Text style={{...styles.menuText, color: colors.text}}>New Brew</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {Clipboard.setString(toBeansString(selected)); Alert.alert("Copied", `"${selected.roaster} - ${selected.name}" copied to clipboard`, [{text: "OK", onPress: () =>  setBtmModal(false)}])}}>
                    <View style={styles.menuItem}>
                        <Feather name="copy" size={22} color={colors.text}/>
                        <Text style={{...styles.menuText, color: colors.text}}>Copy Beans to Clipboard</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onFavorite(selected.id)}>
                    <View style={styles.menuItem}>
                        <FontAwesome name={selected.favorite === 0?"heart-o":"heart"} size={22} color={colors.text}/>
                        <Text style={{...styles.menuText, color: colors.text}}>{selected.favorite===0?"Favorite":"Unfavorite"}</Text>
                    </View>
                </TouchableOpacity>     
                <TouchableOpacity onPress={() => deleteConfirmation()}>
                    <View style={styles.menuItem}>
                        <Feather name="trash-2" size={22} color={colors.destructive}/>
                        <Text style={{...styles.menuText, color: colors.destructive}}>Delete</Text>
                    </View>
                </TouchableOpacity> 
            </FullScreenModal>}
        </View>
    );
}

export default HomePage;

const styles = StyleSheet.create({
    newModal: {
        zIndex: 1,
        borderBottomWidth: 1
    },
    beansRow: {
        width: "100%", 
        borderBottomWidth: 1,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        fontSize: 18,
    },
    btmModal: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderWidth: 1,
        borderTopStartRadius: 15,
        borderTopEndRadius: 15, 
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    modalRow: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center'
    },
    modalText: {
        fontSize: 18
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 15
    },
    menuText: {
        fontSize: 18,
        marginLeft: 10,
    }
});