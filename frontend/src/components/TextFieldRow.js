import React, { useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback
} from 'react-native';
import { useTheme } from '@react-navigation/native';

const TextFieldRow = ({title, text, onChange, onEndEditing, keyboardType, children, style, titleOnly, activeTextColor}) => {
    const { colors } = useTheme();
    
    const ref_textBox = useRef();

    return (
        <TouchableWithoutFeedback onPress={() => ref_textBox.current.focus()}>
            <View style={[styles.row,
                {
                    backgroundColor: colors.card, 
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderColor: colors.border,
                },
                style
            ]}>
                <View style={{flexDirection: 'column'}}>
                    {(text !== "" && text !== 0 && !titleOnly) ? <Text style={{...styles.title, color: colors.text}}>{title}</Text> : <View/>}
                    <TextInput 
                        style={{...styles.text, color: activeTextColor||colors.text}} 
                        value={!text ? "" : text.toString()} 
                        placeholder={title}
                        placeholderTextColor={colors.placeholder}
                        onChangeText={onChange}
                        onEndEditing={onEndEditing}
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