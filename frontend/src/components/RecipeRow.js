import React from 'react';
import {
    View,
    StyleSheet,
    Text
} from 'react-native';
import { useTheme } from '@react-navigation/native';

import { Entypo, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import CoffeeBean from '../../assets/icons/coffeeBean.svg';
import CoffeeGrounds from '../../assets/icons/coffeeGrounds.svg';

function RecipeRow({ brew }) {
    const { colors } = useTheme();

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
            <View style={styles.item}>
                <Entypo name="water" size={20} color="#0069A7"/>
                <Text style={{...styles.value, color: colors.text}}>{brew.water}</Text>
                <Text style={{fontSize: 12, color: colors.text}}>{brew.water_unit}</Text>
            </View>
            <View style={styles.item}>
                <CoffeeBean width={20} height={20} style={{color: "#714B33"}}/>
                <Text style={{...styles.value, color: colors.text}}>{brew.coffee}</Text>
                <Text style={{fontSize: 12, color: colors.text}}>{brew.coffee_unit}</Text>
            </View>
            <View style={styles.item}>
                <CoffeeGrounds width={20} height={20} style={{color: "#714B33"}}/>
                <Text style={{...styles.value, color: colors.text}}>{brew.grind_setting}</Text>
            </View>
            <View style={styles.item}>
                <FontAwesome5 size={20} name="fire" color="#EB811E"/>
                <Text style={{...styles.value, color: colors.text}}>{brew.temperature}°</Text>
                <Text style={{fontSize: 12, color: colors.text}}>{brew.temp_unit}</Text>
            </View>
            <View style={styles.item}>
                <MaterialCommunityIcons name="timer" size={20} color="#4D814B"/>
                <Text style={{...styles.value, color: colors.text}}>{brew.time}</Text>
            </View>
        </View>
    );
}

export default RecipeRow;

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'center'
    },
    value: {
        fontSize: 15,
        marginLeft: 3
    },
});

