import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity,
    Share,
    PixelRatio,
    Alert
} from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { FontAwesome, Feather, Octicons } from '@expo/vector-icons';

import * as Device from 'expo-device';
import { captureRef } from 'react-native-view-shot';

import * as Clipboard from 'expo-clipboard';

let {height, width} = Dimensions.get('window');

// Component Imports
import { SegmentedControl } from 'react-native-ios-kit';
import Header from '../components/Header';
import Brew from '../components/Brew';
import DraggableDrawer from '../components/DraggableDrawer';
import Icon from '../components/Icon';
import FullScreenModal from '../components/FullScreenModal';
import { toBrewString } from '../utils/Converter';

const DisplayBeans = ({ route, navigation }) => {
    const [beans, setBeans] = useState({
        region: "", 
        roaster: "", 
        origin: "", 
        roast_level: "", 
        roast_date: new Date(), 
        price: 0, 
        weight: 0, 
        weight_unit: "g"
    }); // Beans state
    const [brews, setBrews] = useState([]); // Array of brews for given beans
    const [flavorNotes, setFlavorNotes] = useState([]); // Array of flavor notes
    const [loadingBeans, setLoadingBeans] = useState(true); // Page initially loading state
    const [loadingBrews, setLoadingBrews] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // List refreshing state
    const [showModal, setShowModal] = useState(false);
    const [iconRendered, setIconRendered] = useState(false); // Icon rendered state to waiting to share the screen
    const [selected, setSelected] = useState({});

    const brewRef = useRef();

    // Search State Variables
    const [searchQuery, setSearchQuery] = useState(""); // UNUSED
    const [searchResults, setSearchResults] = useState([]); // UNUSED
    const [sortBy, setSortBy] = useState("brew_date");

    const { beans_id } = route.params; // Beans_id for which beans to display
    const { colors } = useTheme(); // Color theme

    const beansContainer = useRef();

    // Format roast_date
    const options = { weekdate: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    function roastDate() {
        if (beans.roast_date === "") return "";
        let date = new Date(beans.roast_date);
        return date.toLocaleDateString('en-US', options);
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

    // Delete brew
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
                setShowModal(false);
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

    // Refresh the list of brews
    const onRefresh = () => {
        setRefreshing(true);
        db.transaction(
            (tx) => {
                tx.executeSql(
                    `SELECT brews.*, beans.roaster, beans.region 
                    FROM brews 
                    LEFT JOIN beans 
                    ON brews.beans_id = beans.id 
                    WHERE beans_id = ?;`,
                    [beans_id],
                    (_, { rows: { _array } }) => {
                        setBrews(_array.sort(compare));
                    }
                );
            },
            (e) => console.log(e),
            () => setRefreshing(false)
        );
    }

    // Split flavor_notes into array
    useEffect(() => {
        if (beans.flavor_notes !== undefined)
            setFlavorNotes(beans.flavor_notes.split(','));
        if (beans.flavor_notes === "")
            setFlavorNotes([]);
    }, [beans]);

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

    // Capture Image of Beans
    async function captureBeans() {
        const targetPixelCount = 1080;
        const pixelRatio = PixelRatio.get();
        const pixels = targetPixelCount / pixelRatio;

        const image = await captureRef(beansContainer, {
            result: 'tmpfile',
            width: pixels,
            shapshotContentContainer: true,
            quality: 1,
            format: 'png',
        });
        onShare(image);
    } 
    
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

    // If share option in route, capture scroll view
    useFocusEffect(
        useCallback(() => {
            if (route.params?.share && !loadingBeans && iconRendered) {
                captureBeans();
            }
        }, [route.params?.share, loadingBeans, iconRendered])
    );

    // Retrieve beans and associated brews from database on mounted
    useFocusEffect(
        useCallback(() => {
            let mounted = true;
            db.transaction(
                (tx) => {
                    tx.executeSql(
                        `SELECT * 
                        FROM beans 
                        WHERE id = ?;`,
                        [beans_id],
                        (_, { rows: { _array } }) => {
                            if (mounted) setBeans(_array[0]);
                        }
                    );                    
                },
                (e) => console.log(e), () => setLoadingBeans(false)
            );

            db.transaction(
                (tx) => {
                    tx.executeSql(
                        `SELECT brews.*, beans.roaster, beans.region 
                        FROM brews 
                        LEFT JOIN beans 
                        ON brews.beans_id = beans.id 
                        WHERE beans_id = ?;`,
                        [beans_id],
                        (_, { rows: { _array } }) => {
                            if (mounted) setBrews(_array.sort(compare));
                        }
                    );
                },
                (e) => console.log(e),
                () => setLoadingBrews(false)
            )
            return () => mounted = false;
        }, [])
    );

    // RenderItem for brews FlatList
    const renderItem = ({item}) => (
        <Brew 
            brew={item} 
            colors={colors} 
            navigation={navigation}
            onLongPress={() => {setSelected(item); setShowModal(true);}}
        />
    );

    const keyExtractor = useCallback(
        (item) => item.id.toString(), []
    );

    // Add brew button at the bottom of the screen or brew list
    const AddBrewButton = () => {
        return (
            <View style={{width: '100%', padding: 10, marginBottom: 5}}>
                <TouchableOpacity onPress={() => navigation.navigate("NewBrew", { beans_id: beans.id, roaster: beans.roaster, region: beans.region })}>
                    <View style={{...styles.addBrewsButton, backgroundColor: colors.card, borderColor: colors.border}}>
                        <Text style={{fontSize: 16, margin: 10, color: colors.text}}>Add Brew</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );  
    }

    return (
        <View style={styles.container}>
            {loadingBeans ? 
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator size="large"/>
            </View> 
            : <>
            <Header 
                title="Beans" 
                leftText="Back" rightText="Edit" 
                leftOnPress={() => navigation.goBack()} 
                rightOnPress={() => navigation.navigate("EditBeans", {beans: beans, flavor_notes: beans.flavor_notes})}/>
            <ScrollView style={{flex: 1}} ref={beansContainer} style={{backgroundColor: colors.background}}>
            <View style={styles.row}>
                <View style={{flexDirection: 'row', width: width-45, flexWrap: 'wrap'}}>
                    <Text style={{...styles.title, color: colors.text}}>{beans.roaster} </Text>
                    <Text style={{...styles.subtitle, color: colors.text}}>{beans.region}</Text>
                </View>
                <View style={styles.favorite}>
                    <FontAwesome name={beans.favorite?"heart":"heart-o"} size={25} color={beans.favorite?"#a00": colors.placeholder}/>
                </View>
            </View>
            <View style={styles.row}>
                <Text style={{fontSize: 18, color: colors.text}}>Origin: {beans.origin}</Text>
            </View> 
            {Device.osVersion >= 13 && 
            <View style={styles.row}>
                {roastDate()!==""&&<Text style={{fontSize: 16, color: colors.text}}>Roasted: {roastDate()}</Text>}
            </View>}
            <View style={styles.flavors}>
                {flavorNotes.map((item) => 
                    <View key={item } style={{...styles.flavor, backgroundColor: colors.card, borderColor: colors.border}}>
                        <Text style={{...styles.flavorText, color: colors.text}}>{item}</Text>
                    </View>
                )}
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', margin: 10}}>
                <Icon uri={beans.photo_uri} size={(width/3)*2} onRender={() => setIconRendered(true)}/>
                <Text style={{color: colors.text}}>{beans.weight}{beans.weight_unit}</Text>
            </View>
            </ScrollView>
            {brews.length > 0 ?
            <DraggableDrawer title="Brews" colors={colors}>
                <View style={{width: '100%'}}>
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
                <FlatList
                    data={brews}
                    horizontal={false}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                    initialNumToRender={3}
                    maxToRenderPerBatch={3}
                    windowSize={7}
                    ListFooterComponent={() => <AddBrewButton/>}
                />
            </DraggableDrawer>
            :loadingBrews ?
                <ActivityIndicator size="large"/>
                :<AddBrewButton/>}
            </>}
            <View ref={brewRef} style={{position: 'absolute', width: width, left: width}}>
                {selected.id&&<Brew
                    brew={selected} 
                    colors={colors}
                    favorite={selected.favorite}
                    navigation={navigation}
                    share={true}
                />}
            </View>
            {showModal && <FullScreenModal colors={colors} close={() => setShowModal(false)}>
                <TouchableOpacity onPress={() => navigation.navigate("EditBrew", { parent: "DisplayBeans", brew_id: selected.id })}>
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
                <TouchableOpacity onPress={() => {Clipboard.setString(toBrewString(selected)); Alert.alert("Copied", "Copied brew recipe to clipboard.", [{text: "OK", onPress: () =>  setShowModal(false)}])}}>
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

export default DisplayBeans;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 5,
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    favorite: {
        position: 'absolute',
        right: 0
    },
    animated: {
        position: 'absolute',
        bottom: 0,
        width: width,
        borderTopStartRadius: 15,
        borderTopEndRadius: 15,
        borderWidth: 1,
        height: height/1.5,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 22,
    },
    subtitle: {
        fontSize: 22,
    },
    flavors: {
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'center',
        flexWrap: 'wrap'
    },  
    flavor: {
        display: 'flex',
        marginLeft: 10,
        marginBottom: 15,
        borderWidth: 1,
        padding: 10,
        borderRadius: 15
    },
    flavorText: {
        fontSize: 16
    },
    addBrewsButton: {
        width: '100%',
        alignSelf: 'center', 
        borderWidth: 1, 
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
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