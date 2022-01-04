import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
    Alert
} from 'react-native';

import { Feather, FontAwesome5 } from '@expo/vector-icons';

import { useTheme, useFocusEffect } from '@react-navigation/native';

// Component Imports
import { SegmentedControl } from 'react-native-ios-kit';
import Header from '../components/Header';
import RowItem from '../components/RowItem';
import SearchBar from '../components/SearchBar';

const Brew = ({brew, onLongPress, navigation}) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity 
            onPress={() => navigation.navigate("DisplayBrew", { brew_id: brew.id, parent: "ListBrews" })}
            onLongPress={onLongPress}
        >
            <View style={{...styles.brewRow, borderColor: colors.border}}> 
                <View style={{flexDirection: 'column', margin: 15}}>
                    <Text style={{fontWeight: 'bold', fontSize: 18, color: colors.text}}>{brew.brew_method}</Text>
                </View>
                <TouchableOpacity
                    style={{position: 'absolute', padding: 15, right: 0, top: 0}}
                    onPress={() => onLongPress()}
                >
                    <FontAwesome5 name="ellipsis-h" size={18} color={colors.placeholder}/>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const ListBrews = ({ navigation }) => {
    const { colors } = useTheme(); // Theme colors
    const [btmModal, setBtmModal] = useState(false); // Bottom modal state
    const [selected, setSelected] = useState({});
    const [brews, setBrews] = useState([]); // Brews array
    const [refreshing, setRefreshing] = useState(false);

    const ref_flatlist = useRef();

    // Search state variables
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [sortBy, setSortBy] = useState("brew_date");

    // Filter search queries by roaster and name
    function searchFilter(item, query) {
        query = query.toLowerCase();
        if (item.brew_method.toLowerCase().includes(query))
            return true;
        return false;        
    }

    // Update search query state and filter results
    function handleSearch(newSearchQuery) {
        setSearchQuery(newSearchQuery);
        setSearchResults(brews.filter(item => searchFilter(item, newSearchQuery) ));
    }

    // Compare function for sorting brews
    const compare = useCallback(
        (a, b) => {
            if (sortBy === "brew_date") {
                a = new Date(a.date).setHours(0,0,0,0);
                b = new Date(b.date).setHours(0,0,0,0);
                if (a > b) return -1;
                if (a < b) return 1;
                return 0;
            }
            if (sortBy === "rating") {
                return b.rating - a.rating;
            }
            return a - b;
        },
        [sortBy]
    );

    // Delete Brew
    const onDelete = (id) => {
        // Delete from database
        db.transaction(
            (tx) => {
                tx.executeSql(
                `DELETE
                FROM brews
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
            "Are you sure you want to permanently delete this brew? You can’t undo this action.",
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
                    "SELECT * FROM brews;",
                    [],
                    (_, { rows: { _array } }) => {
                        setBrews(_array.sort(compare));
                    }
                );
            },
            (e) => console.log(e),
            () => setRefreshing(false)
        );
    }

    // Retrieve list of brews when component mounts
    useFocusEffect(
        useCallback(()=> {
            let mounted = true;
            setBtmModal(false);
            setRefreshing(true);
            db.transaction((tx) => {
                tx.executeSql("SELECT * FROM brews;",
                [],
                (_, { rows: { _array } }) => {
                    if (mounted) setBrews(_array.sort(compare));
                });
            },
            (e) => console.log(e),
            () => setRefreshing(false));
            return () => mounted = false;
        }, [])
    );

    const renderItem = useCallback(
        ({item, index}) => <Brew brew={item} onDelete={onDelete} onLongPress={() => {setSelected(item); setBtmModal(true);}} navigation={navigation}/>,
        []
    );

    const keyExtractor = useCallback((item) => item.id.toString(), []);

    return (
        <View style={{flex: 1, flexDirection: 'column', backgroundColor: colors.background}}>
            <Header 
                title="My Brews"
                leftText="Settings" rightText="New" 
                leftOnPress={()=>navigation.navigate("SettingsPage")} 
                rightOnPress={console.log("NEW")}/>
            <SearchBar searchQuery={searchQuery} setSearchQuery={handleSearch}/> 
            <View style={{backgroundColor: colors.card, borderBottomWidth: 1, borderColor: colors.border}}>
                <SegmentedControl
                    values={['Brew Date', 'Rating']}
                    selectedIndex={0}
                    onValueChange={(value, index) => {
                        if (index === 0) {
                            setSortBy("brew_date");
                        } else {
                            setSortBy("rating");
                        }
                    }}
                    style={{ marginHorizontal: 10, marginBottom: 10 }}
                />
            </View>
            {brews.length === 0 ? 
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: colors.placeholder, fontSize: 18}}>No Brews</Text>
            </View> : 
            <FlatList 
                ref={ref_flatlist}
                data={searchQuery===""?brews:searchResults}
                renderItem={renderItem}
                maxToRenderPerBatch={6}
                initialNumToRender={3}
                keyExtractor={keyExtractor}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />}
        </View>
    );
}

export default ListBrews;

const styles = StyleSheet.create({
    newModal: {
        zIndex: 1,
        borderBottomWidth: 1
    },
    brewRow: {
        width: "100%", 
        borderBottomWidth: 1,
        padding: 10,
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