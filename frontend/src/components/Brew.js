import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import * as Device from 'expo-device';
import { Entypo, MaterialCommunityIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';

// Assets
import CoffeeBean from '../../assets/icons/coffeeBean.svg';

// Component Imports
import TastingWheel from './TastingWheel';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Brew = ({ brew, onFavorite, navigation, onLongPress, share }) => {
    const {colors} = useTheme(); // Color theme

    // Generate date format: 'Month D, YYYY'
    const options = { weekdate: 'long', year: 'numeric', month: 'long', day: 'numeric' }; // Options for date string
    var brew_date = new Date(brew.date);
    let date_string = brew_date.toLocaleDateString('en-US', options);

    // Add Favorite
    function toggleFavorite(e) {
        e.stopPropagation(); // Prevent card from being clicked
        onFavorite(brew.id); // API call pass by parent
    }

    return (
        <TouchableOpacity onPress={() => navigation.navigate("DisplayBrew", { brew_id: brew.id })} onLongPress={onLongPress}>
            <View style={{...styles.brew, backgroundColor: colors.card, borderColor: colors.border}}>
                <View style={styles.wheel}>
                    <TastingWheel displayText={false} width="150" height="150" values={[brew.body, brew.aftertaste, brew.sweetness, brew.aroma, brew.flavor, brew.acidity]}/>
                    {share&&<Text style={{top: -10, fontWeight: 'bold', color: colors.text}}>{brew.roaster}</Text>}
                    {share&&<Text style={{top: -5, color: colors.text}}>{brew.region}</Text>}
                </View>
                <View style={styles.leftItems}>
                    <View style={styles.cardItem}>
                        <Text style={{...styles.title, color: colors.text}}>{brew.brew_method}</Text>
                    </View>
                    <View style={styles.cardItem}>
                        <View style={styles.iconContainer}>
                            <Entypo name="water" size={22} color="#0069A7"/>
                        </View>
                        <Text style={{...styles.value, color: colors.text}}>{brew.water}</Text>
                        <Text style={{color: colors.text}}>{brew.water_unit}</Text>
                    </View>
                    <View style={styles.cardItem}>
                        <View style={styles.iconContainer}>
                            <CoffeeBean width={22} height={22} style={{color: "#714B33"}}/>
                        </View>
                        <Text style={{...styles.value, color: colors.text}}>{brew.coffee}</Text>
                        <Text style={{color: colors.text}}>{brew.coffee_unit}</Text>
                    </View>
                    <View style={styles.cardItem}>
                        <View style={styles.iconContainer}>
                            <FontAwesome5 name="fire" size={22} color="#EB811E"/>
                        </View>
                        <Text style={{...styles.value, color: colors.text}}>{brew.temperature}</Text>
                        <Text style={{color: colors.text}}>°{brew.temp_unit}</Text>
                    </View>
                    <View style={styles.cardItem}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="timer" size={22} color="#4D814B"/>
                        </View>
                        <Text style={{...styles.value, color: colors.text}}>{brew.time}</Text>
                    </View>
                    <View style={styles.rating}>
                        {Array(brew.rating).fill().map((_, idx)=>idx).map((value) => (
                            <FontAwesome key={value} name="star" size={18} color={'rgb(255,149,67)'}/>
                        ))}
                        {Array(5-brew.rating).fill().map((_, idx)=>idx).map((value) => (
                            <FontAwesome key={value} name="star-o" size={18} color={'rgb(255,149,67)'}/>
                        ))}
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={toggleFavorite}>
                    <View style={styles.favorite}>
                        <FontAwesome icon={brew.favorite?"heart":"heart-o"} size={18} color={brew.favorite?"#a00": colors.placeholder}/>
                    </View>
                </TouchableWithoutFeedback>
                {Device.osVersion >= 13 && <Text style={{...styles.date, color: colors.text}}>{date_string}</Text>}
            </View>
        </TouchableOpacity>
    );
}

export default Brew;

const styles = StyleSheet.create({
    beans: {
        margin: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 18,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24
    },
    brew: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 5,
        marginHorizontal: 10,
        borderWidth: 0.8,
        height: 250,
        borderRadius: 10,
        paddingHorizontal: 10,
        overflow: 'hidden'
    },
    leftItems: {
        height: '100%',
        flexDirection: 'column',
        position: 'absolute',
        left: 10,
        top: 5
    },  
    wheel: {
        alignSelf: 'flex-end',
        alignItems: 'center'
    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    value: {
        fontSize: 18,
        marginLeft: 2,
        marginRight: 1,
    },
    date: {
        position: 'absolute',
        bottom: 10, 
        right: 10,
        fontSize: 16
    },  
    notes: {
        overflow: 'hidden',
        width: "55%",
    },
    rating: {
        position: 'absolute',
        bottom: 15,
        flexDirection: 'row'
    },
    favorite: {
        position: 'absolute',
        flexDirection: 'row',
        top: 10,
        right: 10,
        zIndex: 1
    }
});