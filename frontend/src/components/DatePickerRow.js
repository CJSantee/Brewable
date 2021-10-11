import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

let {height, width} = Dimensions.get('window');

const DatePickerRow = ({title, value, onChange}) => {
    const {colors} = useTheme();

    return (
        <View
            style={[
                styles.row,
                {
                    backgroundColor: colors.card, 
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderColor: colors.border,
                }
            ]}
        >
            <Text style={styles.text}>{title}</Text>
            <View style={title ? styles.rightPicker : styles.centerPicker}>
                <DateTimePicker
                    title="Test"
                    mode="date"
                    value={value}
                    display="default"          
                    onDateChange={onChange}
                    style={{width: 320}}
                />
            </View>  
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