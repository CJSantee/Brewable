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

const DatePickerRow = ({open}) => {
    const {colors} = useTheme();
    const [date, setDate] = useState(new Date());

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
            <View style={{position: 'absolute', right: 0, width: width/2, alignItems: 'center'}}>
                <DateTimePicker
                    title="Test"
                    mode="date"
                    value={date}
                    display="default"          
                    onDateChange={setDate}
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
    minHeight: 43,
  },
  title: {
    fontSize: 10,
  },
  text: {
    fontSize: 17,
    fontWeight: '400'
  }
});