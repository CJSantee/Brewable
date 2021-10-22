import React, { useCallback, useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    Modal
} from 'react-native';

import { useAssets } from 'expo-asset';

import { useTheme, useFocusEffect } from '@react-navigation/native';
import { faChevronRight, faPencilAlt, faShare, faTrash, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

// Component Imports
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Header from '../components/Header';
import RowItem from '../components/RowItem';
import SearchBar from '../components/SearchBar';
import SwipeableRow from '../components/SwipeableRow';

// Modal for listing new beans or brew
const NewModal = ({ navigation }) => {
    const {colors} = useTheme();

    return (
        <View style={styles.newModal}>
            <RowItem title="Beans" text="" onPress={() => navigation.navigate("NewBeans")}>
                <FontAwesomeIcon icon={faChevronRight} size={20} color={colors.interactive}/>
            </RowItem>
            <RowItem title="Brew" text="" onPress={() => navigation.navigate("NewBrew")}>
                <FontAwesomeIcon icon={faChevronRight} size={20} color={colors.interactive}/>
            </RowItem>
        </View>
    );
}

const Beans = ({beans, onDelete, onLongPress, onSelect, navigation}) => {
    const {colors} = useTheme();
    const [assets] = useAssets([require('../../assets/BeansBag.png')]);

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

    return (
        // <SwipeableRow onSwipeLeft={() => console.log("Swiped left")} onSwipeRight={deleteConfirmation}>
            <TouchableOpacity 
                onPress={() => navigation.navigate("DisplayBeans", {beans_id: beans.id, parent: "HomePage"})}
                onLongPress={onLongPress}
            >
                <View style={{...styles.beansRow, borderColor: colors.border}}> 
                    <Image source={beans.photo_uri?{uri: beans.photo_uri}:require('../../assets/BeansBag.png')} style={{
                        width: 80, 
                        height: 80, 
                        borderRadius: beans.photo_uri?50:0, 
                        resizeMode: 'cover',
                        borderWidth: beans.photo_uri?1:0,}}/>
                    <View style={{flexDirection: 'column', margin: 15}}>
                        <Text style={{fontWeight: 'bold', fontSize: 18}}>{beans.roaster}</Text>
                        <Text style={{fontSize: 16}}>{beans.region}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        // </SwipeableRow>
    );
}

const HomePage = ({ navigation }) => {
    const {colors} = useTheme(); // Theme colors
    const [newModal, setNewModal] = useState(false); // New Modal state
    const [btmModal, setBtmModal] = useState(false); // Bottom modal state
    const [selected, setSelected] = useState(null);
    const [beans, setBeans] = useState([]); // Beans array
    const [refreshing, setRefreshing] = useState(false);

    // Search state variables
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [sortBy, setSortBy] = useState("roast_date");

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
            if (sortBy === "roast_date") {
                a = new Date(a.roast_date).setHours(0,0,0,0);
                b = new Date(b.roast_date).setHours(0,0,0,0);
                if (a < b) return -1;
                if (a > b) return 1;
                return 0;
            }
            return a - b;
        },
        [sortBy]
    );

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
            onRefresh
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
            console.log("HomePage");
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
        (item) => <Beans beans={item.item} onDelete={onDelete} onLongPress={() => setBtmModal(!btmModal)} navigation={navigation}/>,
        []
    );

    const keyExtractor = useCallback((item) => item.id.toString(), []);

    return (
        <View style={{flex: 1, flexDirection: 'column', backgroundColor: colors.background}}>
            <Header title="My Collection" leftText="Settings" rightText="New" leftOnPress={()=>navigation.navigate("ProfilePage")} rightOnPress={()=>setNewModal(!newModal)}/>
            {newModal ? <NewModal navigation={navigation}/> : <View/>}
            {newModal ? <View/> : <SearchBar searchQuery={searchQuery} setSearchQuery={handleSearch}/>}
            {beans === null || beans.length === 0 ? <View/> : 
            <FlatList 
                data={searchQuery===""?beans:searchResults}
                renderItem={renderItem}
                maxToRenderPerBatch={6}
                initialNumToRender={3}
                keyExtractor={keyExtractor}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />}
            <Modal
                animationType="slide"
                transparent={true}
                visible={btmModal}
            >
                <View style={{...styles.btmModal, backgroundColor: colors.card, borderColor: colors.border}}>
                    
                    <TouchableOpacity>
                        
                        <View style={styles.modalRow}>
                            <View style={{position: 'absolute', right: 0, top: 0, zIndex: 1, height: '100%', padding: 5, paddingLeft: 20}}>
                                <TouchableOpacity style={{width: '100%', height: '100%'}} onPress={(e) => {e.stopPropagation(); setBtmModal(!btmModal)}}>
                                    <FontAwesomeIcon icon={faTimesCircle} size={18} />
                                </TouchableOpacity>
                            </View>
                            <FontAwesomeIcon icon={faPencilAlt} size={18} style={{marginHorizontal: 10}}/>
                            <Text style={styles.modalText}>Edit</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={{...styles.modalRow, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border}}>
                            <FontAwesomeIcon icon={faShare} size={18} style={{marginHorizontal: 10}}/>
                            <Text style={styles.modalText}>Share</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={styles.modalRow}>
                            <FontAwesomeIcon icon={faTrash} size={18} style={{marginHorizontal: 10}} color={colors.destructive}/>
                            <Text style={{...styles.modalText, color: colors.destructive}}>Delete</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

export default HomePage;

const styles = StyleSheet.create({
    newModal: {
        zIndex: 1,
        borderColor: "rgb(201, 210, 217)",
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
    }
});