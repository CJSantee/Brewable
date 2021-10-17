import { useTheme } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';

let {height, width} = Dimensions.get('window');

const TextFieldRow = ({title, text, onChange, keyboardType, children, style}) => {
    const {colors} = useTheme();
    
    const ref_textBox = useRef();

    return (
        <TouchableWithoutFeedback onPress={() => ref_textBox.current.focus()}>
            <View
                style={[
                styles.row,
                {
                    backgroundColor: colors.card, 
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderColor: colors.border,
                },
                style
            ]}>
                <View style={{flexDirection: 'column'}}>
                    {text !== "" && text !== 0 ? <Text style={styles.title}>{title}</Text> : <View/>}
                    <TextInput 
                        style={styles.text} 
                        value={text === 0 ? "" : text.toString()} 
                        placeholder={title}
                        onChangeText={onChange}
                        keyboardType={keyboardType}
                        ref={ref_textBox}
                        multiline
                    />
                </View>
                <View style={styles.rightComponent}>
                    {children}
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

export default TextFieldRow;

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
  rightComponent: {
    flexGrow: 1,
    alignItems: 'flex-end',
  },
});