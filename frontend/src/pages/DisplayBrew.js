import React, { useCallback, useState } from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Dimensions
} from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { faTint, faFire, faStopwatch, faHeart as faHeartSolid, faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faStar } from '@fortawesome/free-regular-svg-icons';
import CoffeeBean from '../../assets/icons/coffeeBean.svg';

// Component Imports
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import TastingWheel from '../components/TastingWheel';
import Header from '../components/Header';
import { color } from 'react-native-reanimated';

let {height, width} = Dimensions.get('window');

const DisplayBrew = ({ route, navigation }) => {
    const [brew, setBrew] = useState({body: 0, aftertaste: 0, sweetness: 0, aroma: 0, flavor: 0, acidity: 0, rating: 0}); // Initial values for flavor wheel
    const { brew_id } = route.params; // Brew_id to retireve brew info
    const {colors} = useTheme(); // Color theme

    const options = { weekdate: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    function brewDate() {
        if (brew.date === "") return "";
        let date = new Date(brew.date);
        return date.toLocaleDateString('en-US', options);
    }

    // Load brew by brew.id when component renders
    useFocusEffect(
        useCallback(()=> {
            let mounted = true;
            db.transaction(
                (tx) => {
                    tx.executeSql(
                        `SELECT brews.*, beans.roaster, beans.region 
                        FROM brews 
                        LEFT JOIN beans ON brews.beans_id = beans.id
                        WHERE brews.id = ?;`,
                        [brew_id],
                        (_, { rows: { _array } }) => {
                            if (mounted) setBrew(_array[0]);
                        }
                    );
                },
                (e) => console.log(e), null
            );
            return () => mounted = false;
        }, [])
    );

    return (
        <View style={{...styles.container, backgroundColor: colors.background}}>
            <Header 
                title="Brew" 
                leftText="Back" rightText="Edit" 
                leftOnPress={() => navigation.goBack()} 
                rightOnPress={
                    () => navigation.navigate("EditBrew", { brew_id: brew.id })
                }
            />
            <ScrollView>
                <View style={styles.row}>
                    <View style={{flexDirection: 'row', width: width-45, flexWrap: 'wrap'}}>
                        <Text style={{...styles.title, color: colors.text}}>{brew.roaster} </Text>
                        <Text style={{...styles.subtitle, color: colors.text}}>{brew.region}</Text>
                    </View>
                    <View style={styles.favorite}>
                        <FontAwesomeIcon icon={brew.favorite?faHeartSolid:faHeart} size={25} color={brew.favorite?"#a00": colors.placeholder}/>
                    </View>
                </View>
                <View style={styles.row}>
                    <Text style={{fontSize: 18, color: colors.text}}>{brewDate()} - </Text>
                    <Text style={{fontSize: 18, color: colors.text}}>{brew.brew_method}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 10}}>
                    <View style={styles.item}>
                        <FontAwesomeIcon size={25} icon={faTint} color="#0069A7"/>
                        <Text style={{...styles.value, color: colors.text}}>{brew.water}</Text>
                        <Text style={{color: colors.text}}>{brew.water_unit}</Text>
                    </View>
                    <View style={styles.item}>
                        <CoffeeBean width={25} height={25} style={{color: "#714B33"}}/>
                        <Text style={{...styles.value, color: colors.text}}>{brew.coffee}</Text>
                        <Text style={{color: colors.text}}>{brew.coffee_unit}</Text>
                    </View>
                    <View style={styles.item}>
                        <FontAwesomeIcon size={25} icon={faFire} color="#EB811E"/>
                        <Text style={{...styles.value, color: colors.text}}>{brew.temperature}°</Text>
                        <Text style={{color: color.text}}>{brew.temp_unit}</Text>
                    </View>
                    <View style={styles.item}>
                        <FontAwesomeIcon size={25} icon={faStopwatch} color="#4D814B"/>
                        <Text style={{...styles.value, color: colors.text}}>{brew.time}</Text>
                    </View>
                </View>
                <View style={styles.notes}>
                    <Text style={{fontSize: 15, color: colors.text}}>{brew.notes}</Text>
                </View>
                <View style={styles.rating}>
                    {Array(brew.rating).fill().map((_, idx)=>idx).map((value) => (
                        <FontAwesomeIcon key={value} icon={faStarSolid} size={30} color={'rgb(255,149,67)'}/>
                    ))}
                    {Array(5-brew.rating).fill().map((_, idx)=>idx).map((value) => (
                        <FontAwesomeIcon key={value} icon={faStar} size={30} color={'rgb(255,149,67)'}/>
                    ))}
                </View>
                <TastingWheel style={styles.wheel} displayText={true} width={width} height={width} values={[brew.body, brew.aftertaste, brew.sweetness, brew.aroma, brew.flavor, brew.acidity]} />
            </ScrollView>
        </View>
    );
}

export default DisplayBrew;

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
    item: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 5,
        alignItems: 'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 22,
    },
    subtitle: {
        fontSize: 22,
    },
    value: {
        fontSize: 18
    },
    notes: {
        marginHorizontal: 10
    },
    wheel: {
        width: "100%",
        height: "100%",
    },
    rating: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 15
    }
});