import React, { useCallback, useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
    Dimensions,
    Alert,
    Share,
    PixelRatio,
} from 'react-native';
import { Feather, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { captureRef } from 'react-native-view-shot';

import * as Clipboard from 'expo-clipboard';

let {height, width} = Dimensions.get('window');

// Component Imports
import { SegmentedControl } from 'react-native-ios-kit';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import Brew from '../components/Brew';
import RecipeRow from '../components/RecipeRow';
import Stars from '../components/Stars';
import FullScreenModal from '../components/FullScreenModal';
import { toBrewString, toSimpleDate } from '../utils/Converter';

const BrewRow = ({brew, onLongPress, navigation}) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity 
            onPress={() => navigation.navigate("DisplayBrew", { brew_id: brew.id, parent: "Brews" })}
            onLongPress={onLongPress}
        >
            <View style={{...styles.brewRow, borderColor: colors.border}}> 
                <View style={{flexDirection: 'column', width: '100%'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{fontWeight: 'bold'}}>{brew.roaster}{" "}</Text>
                        <Text>{brew.name}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text>{brew.brew_method}{" "}</Text>
                        <Text>{toSimpleDate(brew.date)}</Text>
                    </View>
                    <View style={{width: '100%', alignItems: 'center', marginTop: 10}}>
                        <Stars width={'80%'} size={20} value={brew.rating}/>
                    </View>
                    <RecipeRow brew={brew}/>
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

    const brewRef = useRef();
    const ref_flatlist = useRef();

    const user_preferences = useSelector(state => state.user_preferences); // User preferences (Redux)

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

    // Share Image
    const onShare = async (image) => {
        try {
            await Share.share({
                url: image
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    // Capture Image of Brew
    async function captureBrew() {
        const targetPixelCount = 1080;
        const pixelRatio = PixelRatio.get();
        const pixels = targetPixelCount / pixelRatio;

        const image = await captureRef(brewRef, {
            result: 'tmpfile',
            width: width,
            height: 250,
            quality: 1,
            format: 'png',
        });
        onShare(image);
    }

    // Set Brew as Favorite
    const onFavorite = (id) => {
        let val = 0;
        brews.forEach(brew => {if (brew.id === id) val = brew.favorite});
        // Update brew in database
        db.transaction(
            (tx) => {
                tx.executeSql("UPDATE brews SET favorite = ? WHERE id = ?;", [val===0?1:0, id])
            }, 
            (e) => console.log(e), 
            null
        );
        // Update brew state within component
        setBrews(brews.map(brew => (brew.id === id ? {...brew, favorite: brew.favorite===0?1:0}:brew)));
        setSelected({...selected, favorite: val===0?1:0})
    }

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
                    `SELECT brews.*, beans.roaster, beans.name 
                    FROM brews 
                    LEFT JOIN beans 
                    ON brews.beans_id = beans.id;`,
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
                tx.executeSql(
                    `SELECT brews.*, beans.roaster, beans.name 
                    FROM brews 
                    LEFT JOIN beans 
                    ON brews.beans_id = beans.id;`,
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
        ({item, index}) => <BrewRow brew={item} onDelete={onDelete} onLongPress={() => {setSelected(item); setBtmModal(true);}} navigation={navigation}/>,
        []
    );

    const keyExtractor = useCallback((item) => item.id.toString(), []);

    return (
        <View style={{flex: 1, flexDirection: 'column', backgroundColor: colors.background}}>
            <Header 
                title="My Brews"
                leftText="Settings" rightText="New" 
                leftOnPress={()=>navigation.navigate("SettingsPage")} 
                rightOnPress={()=>navigation.navigate("NewBrew")}/>
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
            <View ref={brewRef} style={{position: 'absolute', width: width, left: width}}>
                {selected.id&&<Brew
                    brew={selected} 
                    colors={colors}
                    favorite={selected.favorite}
                    navigation={navigation}
                    share={true}
                />}
            </View>
            {btmModal && <FullScreenModal colors={colors} close={() => setBtmModal(false)}>
                <TouchableOpacity onPress={() => navigation.navigate("EditBrew", { parent: "Brews", brew_id: selected.id })}>
                    <View style={styles.menuItem}>
                        <Feather name="edit" size={22} color={colors.text}/>
                        <Text style={{...styles.menuText, color: colors.text}}>Edit</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => captureBrew()}>
                    <View style={styles.menuItem}>
                        <Feather name="share" size={22} color={colors.text}/>
                        <Text style={{...styles.menuText, color: colors.text}}>Share</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("ReviewRecipe", { brew: selected })}>
                    <View style={{...styles.menuItem, borderBottomWidth: 1.5, borderColor: colors.border}}>
                        <Feather name="file-text" size={22} color={colors.text}/>
                        <Text style={{...styles.menuText, color: colors.text}}>Suggest New Recipe</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {Clipboard.setString(toBrewString(selected, user_preferences.grinder)); Alert.alert("Copied", "Copied brew recipe to clipboard.", [{text: "OK", onPress: () =>  setBtmModal(false)}])}}>
                    <View style={styles.menuItem}>
                        <Feather name="copy" size={22} color={colors.text}/>
                        <Text style={{...styles.menuText, color: colors.text}}>Copy Brew to Clipboard</Text>
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
        alignItems: 'center',
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