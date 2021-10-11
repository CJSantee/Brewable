import { useTheme } from '@react-navigation/native';
import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import { Slider } from 'react-native-ios-kit';

const SliderRow = ({title, value, onValueChange, onPress}) => {
    const {colors} = useTheme();

    return (
        <TouchableOpacity onPress={onPress}>
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
              <View style={{flexDirection: 'column', width: '100%', alignItems: 'center'}}>
                  <Text >{title}</Text>
                  <Slider 
                      value={value}
                      onSlidingComplete={onValueChange}
                      theme={{primaryColor: colors.primary}}
                  />
              </View>
          </View>  
        </TouchableOpacity>
    );
};

export default SliderRow;

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
  },
  rightComponent: {
    flexGrow: 1,
    alignItems: 'flex-end',
  },
});