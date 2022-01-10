import React from 'react';
import {
    View,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function Stars({ width, size, value }) {
    return (
        <View style={{width: width, flexDirection: 'row', justifyContent: 'space-between'}}>
            {Array(value).fill().map((_, idx)=>idx).map((mapVal) => (
                <FontAwesome key={mapVal} name="star" size={size} color={'rgb(255,149,67)'}/>
            ))}
            {Array(5-value).fill().map((_, idx)=>idx).map((mapVal) => (
                <FontAwesome key={mapVal} name="star-o" size={size} color={'rgb(255,149,67)'}/>
            ))}
        </View>
    );
}