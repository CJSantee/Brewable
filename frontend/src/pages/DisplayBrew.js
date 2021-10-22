import React, { useCallback, useState } from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Dimensions
} from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { faTint, faFire, faStopwatch, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import CoffeeBean from '../../assets/coffeeBean.svg';

// Component Imports
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import TastingWheel from '../components/TastingWheel';
import Header from '../components/Header';

let {height, width} = Dimensions.get('window');

const DisplayBrew = ({ route, navigation }) => {
    const [brew, setBrew] = useState({body: 0, aftertaste: 0, sweetness: 0, aroma: 0, flavor: 0, acidity: 0}); // Initial values for flavor wheel
    const { brew_id } = route.params; // Brew_id to retireve brew info
    const {colors} = useTheme(); // Color theme

    const options = { weekdate: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    function brewDate() {
        if (brew.date === "") return "";
        let date = new Date(brew.date);
        return date.toLocaleDateString('en-US', options);
    }

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
                    <Text style={styles.title}>{brew.roaster} </Text>
                    <Text style={styles.subtitle}>{brew.region}</Text>
                </View>
                <View style={styles.favorite}>
                    <FontAwesomeIcon icon={brew.favorite?faHeartSolid:faHeart} size={25} color={brew.favorite?"#a00": colors.placeholder}/>
                </View>
                <View style={styles.row}>
                    <Text style={{fontSize: 18}}>{brewDate()} - </Text>
                    <Text style={{fontSize: 18}}>{brew.brew_method}</Text>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 10}}>
                    <View style={styles.row}>
                        <FontAwesomeIcon size={25} icon={faTint} color="#0069A7"/>
                        <Text style={styles.value}>{brew.water}</Text>
                        <Text>{brew.water_unit}</Text>
                    </View>
                    <View style={styles.row}>
                        <CoffeeBean width={25} height={25} style={{color: "#714B33"}}/>
                        <Text style={styles.value}>{brew.coffee}</Text>
                        <Text>{brew.coffee_unit}</Text>
                    </View>
                    <View style={styles.row}>
                        <FontAwesomeIcon size={25} icon={faFire} color="#EB811E"/>
                        <Text style={styles.value}>{brew.temperature}°</Text>
                        <Text>{brew.temp_unit}</Text>
                    </View>
                    <View style={styles.row}>
                        <FontAwesomeIcon size={25} icon={faStopwatch} color="#4D814B"/>
                        <Text style={styles.value}>{brew.time}</Text>
                    </View>
                </View>
                
                <View style={styles.notes}>
                    <Text style={{fontSize: 15}}>{brew.notes}</Text>
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
        alignItems: 'center'
    },
    favorite: {
        position: 'absolute',
        right: 10,
        top: 5
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
});