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

const TextFieldRow = ({title, text, onChange, keyboardType, children}) => {
    const [editableText, setEditableText] = useState("");
    const {colors} = useTheme();
    
    const ref_textBox = useRef();

    if (text !== "" && text !== 0) {
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
                    }
                ]}>
                    <View style={{flexDirection: 'column'}}>
                    <Text style={styles.title}>{title}</Text>
                    <TextInput 
                        style={styles.text} 
                        value={text} 
                        onChangeText={(value) => {if (value==="") setEditableText(""); onChange(value);}}
                        keyboardType={keyboardType}
                        ref={ref_textBox}
                    />
                    </View>
                    <View style={styles.rightComponent}>
                        {children}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

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
                }]}
            > 
                <TextInput 
                    style={styles.text} 
                    placeholder={title}
                    value={editableText} 
                    onChangeText={setEditableText} 
                    onEndEditing={() => onChange(editableText)}
                    keyboardType={keyboardType}
                    ref={ref_textBox}
                />
                <View style={styles.rightComponent}>
                    {children}
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

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
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  rightComponent: {
    flexGrow: 1,
    alignItems: 'flex-end',
  },
});