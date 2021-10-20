import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTint, faFire, faStopwatch, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import CoffeeBean from '../assets/coffeeBean.svg';

import { HoldItem } from 'react-native-hold-menu';
import TastingWheel from './components/TastingWheel';

const Brew = ({ brew, menuItems, setFavorite, navigation }) => {
    const {colors} = useTheme(); // Color theme

    // Generate date format: 'Month D, YYYY'
    const options = { weekdate: 'long', year: 'numeric', month: 'long', day: 'numeric' }; // Options for date string
    var brew_date = new Date(brew.date);
    let date_string = brew_date.toLocaleDateString('en-US', options);
    
    // Add Favorite
    function toggleFavorite(e) {
        e.stopPropagation(); // Prevent card from being clicked
        setFavorite(!brew.favorite); // API call pass by parent
    }

    return (
        <HoldItem items={menuItems} key={brew.id}>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("DisplayBrew", { brew_id: brew.id })}>
                <View style={{...styles.brew, backgroundColor: colors.card, borderColor: colors.border}}>
                    <View style={styles.cardItem}>
                        <Text style={{fontWeight: 'bold', fontSize: 18}}>{brew.brew_method}</Text>
                    </View>
                    <View style={styles.cardItem}>
                        <FontAwesomeIcon size={20} icon={faTint} color="#0069A7"/>
                        <Text style={styles.value}>{brew.water}</Text>
                        <Text>{brew.water_unit}</Text>
                    </View>
                    <View style={styles.cardItem}>
                        <CoffeeBean width={20} height={20} style={{color: "#714B33"}}/>
                        <Text style={styles.value}>{brew.coffee}</Text>
                        <Text>{brew.coffee_unit}</Text>
                    </View>
                    <View style={styles.cardItem}>
                        <FontAwesomeIcon size={20} icon={faFire} color="#EB811E"/>
                        <Text style={styles.value}>{brew.temperature}</Text>
                        <Text>°{brew.temp_unit}</Text>
                    </View>
                    <View style={styles.cardItem}>
                        <FontAwesomeIcon size={20} icon={faStopwatch} color="#4D814B"/>
                        <Text style={styles.value}>{brew.time}</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={toggleFavorite}>
                        <View style={styles.favorite}>
                            <FontAwesomeIcon icon={brew.favorite?faHeartSolid:faHeart} size={22} color={brew.favorite?"#a00": colors.placeholder}/>
                            <Text style={{marginLeft: 5, fontWeight: 'bold', fontSize: 16}}>{brew.rating}/5</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TastingWheel style={styles.wheel} displayText={false} width="125" height="125" values={[brew.body*20, brew.aftertaste*20, brew.sweetness*20, brew.aroma*20, brew.flavor*20, brew.acidity*20]}/>
                    <Text style={styles.date}>{date_string}</Text>
                </View>
            </TouchableWithoutFeedback>
        </HoldItem>
    );
}

export default Brew;


const styles = StyleSheet.create({
    beans: {
        margin: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 18,
    },
    brew: {
        flex: 1,
        marginTop: 5,
        marginHorizontal: 10,
        borderWidth: 0.5,
        height: 250,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        overflow: 'hidden'
    },
    wheel: {
        width: "100%",
        height: "100%",
        position: 'absolute',
        top: -10,
        right: -5,
        alignItems: 'flex-end',
    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    value: {
        fontSize: 16,
        marginLeft: 2,
        marginRight: 1,
    },
    date: {
        position: 'absolute',
        bottom: 8, 
        right: 10
    },  
    notes: {
        overflow: 'hidden',
        width: "55%",
    },
    favorite: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        bottom: 8,
        left: 10,
        zIndex: 1,
    }
});