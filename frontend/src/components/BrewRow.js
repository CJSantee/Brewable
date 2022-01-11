import React, { memo } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import RecipeRow from '../components/RecipeRow';
import Stars from '../components/Stars';
import { toSimpleDate } from '../utils/Converter';
import { useTheme } from '@react-navigation/native';

function BrewRow ({brew, onLongPress, navigation}) {
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

function arePropsEqual(prevProps, nextProps) {
    const prevBrew = prevProps.brew;
    const nextBrew = nextProps.brew;
    if (prevBrew.brew_method !== nextBrew.brew_method)
        return false;
    if (prevBrew.water !== nextBrew.water || prevBrew.water_unit !== nextBrew.water_unit)
        return false;
    if (prevBrew.coffee !== nextBrew.coffee || prevBrew.coffee_unit !== nextBrew.coffee_unit)
        return false;
    if (prevBrew.temperature !== nextBrew.temperature || prevBrew.temp_unit !== nextBrew.temp_unit)
        return false;
    if (prevBrew.time !== nextBrew.time)
        return false;
    if (prevBrew.rating !== nextBrew.rating)
        return false;
    if (prevBrew.date !== nextBrew.date)
        return false;
    if (prevBrew.flavor !== nextBrew.flavor)
        return false;
    if (prevBrew.acidity !== nextBrew.acidity)
        return false;
    if (prevBrew.aroma !== nextBrew.aroma)
        return false;
    if (prevBrew.body !== nextBrew.body)
        return false;
    if (prevBrew.sweetness !== nextBrew.sweetness)
        return false;
    if (prevBrew.aftertaste !== nextBrew.aftertaste)
        return false;
    return true;
}

export default memo(BrewRow, arePropsEqual);

const styles = StyleSheet.create({
    brewRow: {
        width: "100%", 
        borderBottomWidth: 1,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    }
});