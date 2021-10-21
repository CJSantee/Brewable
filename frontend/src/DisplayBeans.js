import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    Animated,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import { useTheme, useFocusEffect } from '@react-navigation/native';

let {height, width} = Dimensions.get('window');

import Header from './components/Header';
import Brew from './Brew';
import DraggableDrawer from './components/DraggableDrawer';

const DisplayBeans = ({ route, navigation }) => {
    const [beans, setBeans] = useState({region: "", roaster: "", origin: "", roast_level: "", roast_date: new Date(), price: 0, weight: 0, weight_unit: "g"}); // Beans state
    const [brews, setBrews] = useState([]); // Array of brews for given beans
    const [flavorNotes, setFlavorNotes] = useState([]);
    const [sortBy, setSortBy] = useState("brew_date");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const { beans_id } = route.params; // Beans_id for which beans to display
    const { colors } = useTheme(); // Color theme

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
    }

    // Delete brew
    const onDelete = (id) => {
        // Delete from database
        db.transaction(
            (tx) => {
                tx.executeSql(
                `SELECT brew_method
                FROM brews
                WHERE id = ?;`,
                [id],
                (_, { rows: { _array } }) => {
                    console.log(_array[0]);
                });
            },
            (e) => console.log(e),
            (e) => {
                console.log(e);
                onRefresh();
            }
        );
        // setBrews(brews.filter(brew => brew.id !== id));// Delete from state
    }

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
                (e) => console.log(e), () => setLoading(false)
            );
            return () => mounted = false;
        }, [])
    );

    // RenderItem for brews FlatList
    const renderItem = ({item}) => (
        <Brew 
            brew={item} 
            colors={colors} 
            menuItems={[
                { 
                    text: item.brew_method, 
                    icon: 'edit',
                    onPress:  () => {}
                },
            ]}
            onFavorite={onFavorite} 
            favorite={item.favorite}
            navigation={navigation}
        />
    );

    const keyExtractor = useCallback(
        (item) => item.id.toString(), []
    );

    return (
        <View style={{...styles.container, backgroundColor: colors.background}}>
            {loading ? 
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator size="large"/>
            </View> 
            : <>
            <Header 
                title="Beans" 
                leftText="Back" rightText="Edit" 
                leftOnPress={() => navigation.goBack()} 
                rightOnPress={() => navigation.navigate("EditBeans", {beans: beans, flavor_notes: beans.flavor_notes})}/>
            <View style={styles.row}>
                <Text style={styles.title}>{beans.roaster} </Text>
                <Text style={styles.subtitle}>{beans.region}</Text>
            </View>
            <View style={styles.row}>
                {roastDate()!==""?<Text style={{fontSize: 18}}>{roastDate()}</Text>:<View/>}
                <Text style={{fontSize: 18}}> - {beans.weight}{beans.weight_unit}</Text>
            </View>
            <TouchableOpacity onPress={() => setBrews(brews.filter(brew => brew.brew_method !== "Aeropress"))}>
            <View style={styles.row}>
                <Text>{beans.origin}</Text>
            </View>
            </TouchableOpacity>
            
            <View style={styles.flavors}>
                {flavorNotes.map((item) => 
                    <View key={item } style={styles.flavor}>
                        <Text style={styles.flavorText}>{item}</Text>
                    </View>
                )}
            </View>

            <DraggableDrawer title="- Brews -" colors={colors}>
                <FlatList
                    data={brews}
                    horizontal={false}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                />
            </DraggableDrawer>

            
            {/* CODE FOR TAPPABLE DRAWER, WORKING ON DRAGGABLE
                <Animated.View style={{...styles.animated,
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    height: heightAnim
                }}>
                <TouchableOpacity onPress={hightlightBrews} style={{height: brewsHighlighted?30:60, marginTop: brewsHighlighted?15:20}}>
                    <Text style={{alignSelf: 'center',fontSize: 14, color: colors.placeholder}}>{brews.length === 0?"No Brews":"- Brews -"}</Text>
                </TouchableOpacity>
                
            </Animated.View> */}

            </>}
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
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },  
    flavor: {
        display: 'flex',
        marginHorizontal: 10,
        marginBottom: 15,
        borderWidth: 1,
        padding: 10,
        borderRadius: 15
    },
    flavorText: {
        fontSize: 16
    }
});