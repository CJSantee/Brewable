import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import * as Device from 'expo-device';
import { useSelector } from 'react-redux'

import DateTimePicker from '@react-native-community/datetimepicker';

let {height, width} = Dimensions.get('window');

const DatePickerRow = ({title, value, onChange}) => {
    const { colors } = useTheme(); // Color theme
    const user_preferences = useSelector(state => state.user_preferences); // User preferences (Redux)

    const setDate = (event, selectedDate) => {
      const currentDate = selectedDate || value;
      onChange(currentDate);
    };

    return (
      <View style={[styles.row,
        {
            backgroundColor: colors.card, 
            borderTopWidth: StyleSheet.hairlineWidth,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
        }
      ]}>
        <Text style={{...styles.text, color: colors.placeholder}}>{title}</Text>
        {Device.osVersion >= 13 ?
        <View style={title ? styles.rightPicker : styles.centerPicker}>
            <DateTimePicker
                mode="date"
                value={new Date(value)}
                display="default"          
                onChange={setDate}
                style={{width: 320}}
                themeVariant={user_preferences.theme.toLowerCase()}
            />
        </View> : 
        <Text style={{flex: 1, textAlign: title ? 'right' : 'center', fontSize: 11, color: colors.placeholder}}>update iOS for date</Text>} 
      </View>  
    );
};

export default DatePickerRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 4,
    minHeight: 43
  },
  centerPicker: {
    position: 'absolute', 
    right: 0, 
    width: width/2, 
    alignItems: 'center'
  },
  rightPicker: {
    position: 'absolute',
    right: "-54%"
},
  title: {
    fontSize: 10,
  },
  text: {
    fontSize: 17,
    fontWeight: '400'
  }
});