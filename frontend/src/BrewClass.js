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

import TastingWheel from './components/TastingWheel';

// Converted the Brew functional component to a PureComponent to test Optimization
// So far the functional component appears more effecient for use in FlatList. 
// See https://codingislove.com/optimize-react-native-flatlist-performance/
class BrewClass extends React.PureComponent {
    constructor(props) {
        super(props);
        this.toggleFavorite = this.toggleFavorite.bind(this);
    }

    // Add Favorite
    toggleFavorite(e) {
        e.stopPropagation(); // Prevent card from being clicked
        this.props.setFavorite(!this.props.brew.favorite); // API call pass by parent
    }

    render () {
        const { brew, setFavorite, colors, navigation } = this.props;
        
        // Generate date format: 'Month D, YYYY'
        const options = { weekdate: 'long', year: 'numeric', month: 'long', day: 'numeric' }; // Options for date string
        const brew_date = new Date(this.props.brew.date);
        const date_string = brew_date.toLocaleDateString('en-US', options);

        return (
            <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate("DisplayBrew", {brew_id: this.props.brew.id})}>
            <View style={{...styles.brew, backgroundColor: this.props.colors.card, borderColor: this.props.colors.border}}>
                <View style={styles.cardItem}>
                    <Text style={{fontWeight: 'bold', fontSize: 18}}>{this.props.brew.brew_method}</Text>
                </View>
                <View style={styles.cardItem}>
                    <FontAwesomeIcon size={20} icon={faTint} color="#0069A7"/>
                    <Text style={styles.value}>{this.props.brew.water}</Text>
                    <Text>{this.props.brew.water_unit}</Text>
                </View>
                <View style={styles.cardItem}>
                    <CoffeeBean width={20} height={20} style={{color: "#714B33"}}/>
                    <Text style={styles.value}>{this.props.brew.coffee}</Text>
                    <Text>{this.props.brew.coffee_unit}</Text>
                </View>
                <View style={styles.cardItem}>
                    <FontAwesomeIcon size={20} icon={faFire} color="#EB811E"/>
                    <Text style={styles.value}>{this.props.brew.temperature}</Text>
                    <Text>°{this.props.brew.temp_unit}</Text>
                </View>
                <View style={styles.cardItem}>
                    <FontAwesomeIcon size={20} icon={faStopwatch} color="#4D814B"/>
                    <Text style={styles.value}>{this.props.brew.time}</Text>
                </View>
                <TouchableWithoutFeedback onPress={this.toggleFavorite}>
                    <View style={styles.favorite}>
                        <FontAwesomeIcon icon={this.props.brew.favorite?faHeartSolid:faHeart} size={22} color={this.props.brew.favorite?"#a00": this.props.colors.placeholder}/>
                        <Text style={{marginLeft: 5, fontWeight: 'bold', fontSize: 16}}>{this.props.brew.rating}/5</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TastingWheel style={styles.wheel} displayText={false} width="125" height="125" values={[this.props.brew.body*20, this.props.brew.aftertaste*20, this.props.brew.sweetness*20, this.props.brew.aroma*20, this.props.brew.flavor*20, this.props.brew.acidity*20]}/>
                <Text style={styles.date}>{date_string}</Text>
            </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default BrewClass;


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
        marginTop: 5,
        marginRight: 10,
        borderWidth: 0.5,
        width: 300,
        height: 200,
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