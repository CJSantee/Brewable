import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Feather, FontAwesome } from '@expo/vector-icons';

const RatingRow = ({title, value, onValueChange, onPress}) => {
    const {colors} = useTheme();

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[styles.row,
                {
                    backgroundColor: colors.card, 
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderColor: colors.border,
                }
            ]}>
                <View style={{flexDirection: 'column', width: '100%', alignItems: 'center'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{color: colors.text}}>{title}</Text>
                        <Feather name="chevron-right" size={10} color={colors.interactive}/>
                    </View>
                    <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                        {Array(value).fill().map((_, idx)=>idx).map((mapVal) => (
                            <TouchableOpacity key={mapVal} onPress={() => onValueChange(mapVal+1)}
                                style={{width: 45, height: 45, alignItems: 'center', justifyContent: 'center'}}>   
                                <FontAwesome name="star" size={25} color={colors.interactive}/>
                            </TouchableOpacity>
                        ))}
                        {Array(5-value).fill().map((_, idx)=>idx).map((mapVal) => (
                            <TouchableOpacity key={mapVal} onPress={() => onValueChange(mapVal+value+1)}
                                style={{width: 45, height: 45, alignItems: 'center', justifyContent: 'center'}}>
                                <FontAwesome name="star-o" size={25} color={colors.placeholder}/>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>  
        </TouchableOpacity>
    );
};

export default RatingRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 4,
    minHeight: 43,
  },
  title: {
    fontSize: 10,
  },
  text: {
    fontSize: 17,
    fontWeight: '400'
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  }
});