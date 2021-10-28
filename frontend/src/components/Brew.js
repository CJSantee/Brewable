import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTint, faFire, faStopwatch, faHeart as faHeartSolid, faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faStar } from '@fortawesome/free-regular-svg-icons';
import CoffeeBean from '../../assets/icons/coffeeBean.svg';

import TastingWheel from './TastingWheel';

const Brew = ({ brew, onFavorite, navigation }) => {
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
        <TouchableWithoutFeedback onPress={() => navigation.navigate("DisplayBrew", { brew_id: brew.id })}>
            <View style={{...styles.brew, backgroundColor: colors.card, borderColor: colors.border}}>
                <View style={styles.wheel}>
                    <TastingWheel displayText={false} width="150" height="150" values={[brew.body, brew.aftertaste, brew.sweetness, brew.aroma, brew.flavor, brew.acidity]}/>
                    {false&&<Text style={{top: -10, fontWeight: 'bold'}}>{brew.roaster}</Text>}
                    {false&&<Text style={{top: -5}}>{brew.region}</Text>}
                </View>
                <View style={styles.leftItems}>
                    <View style={styles.cardItem}>
                        <Text style={styles.title}>{brew.brew_method}</Text>
                    </View>
                    <View style={styles.cardItem}>
                        <FontAwesomeIcon size={22} icon={faTint} color="#0069A7"/>
                        <Text style={styles.value}>{brew.water}</Text>
                        <Text>{brew.water_unit}</Text>
                    </View>
                    <View style={styles.cardItem}>
                        <CoffeeBean width={22} height={22} style={{color: "#714B33"}}/>
                        <Text style={styles.value}>{brew.coffee}</Text>
                        <Text>{brew.coffee_unit}</Text>
                    </View>
                    <View style={styles.cardItem}>
                        <FontAwesomeIcon size={22} icon={faFire} color="#EB811E"/>
                        <Text style={styles.value}>{brew.temperature}</Text>
                        <Text>°{brew.temp_unit}</Text>
                    </View>
                    <View style={styles.cardItem}>
                        <FontAwesomeIcon size={22} icon={faStopwatch} color="#4D814B"/>
                        <Text style={styles.value}>{brew.time}</Text>
                    </View>
                    
                    <View style={styles.rating}>
                        {Array(brew.rating).fill().map((_, idx)=>idx).map((value) => (
                            <FontAwesomeIcon key={value} icon={faStarSolid} size={18} color={'rgb(255,149,67)'}/>
                        ))}
                        {Array(5-brew.rating).fill().map((_, idx)=>idx).map((value) => (
                            <FontAwesomeIcon key={value} icon={faStar} size={18} color={'rgb(255,149,67)'}/>
                        ))}
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={toggleFavorite}>
                    <View style={styles.favorite}>
                        <FontAwesomeIcon icon={brew.favorite?faHeartSolid:faHeart} size={18} color={brew.favorite?"#a00": colors.placeholder}/>
                    </View>
                </TouchableWithoutFeedback>
                
                <Text style={styles.date}>{date_string}</Text>
            </View>
        </TouchableWithoutFeedback>
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