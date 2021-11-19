import { useTheme } from '@react-navigation/native';
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// TODO: Add gesture controls to rows
const Row = ({title, text, style, showSelect, selected, toggleSelect, children }) => {
  const {colors} = useTheme();

  return (
    <View style={[styles.row,
      {
        backgroundColor: colors.card, 
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
      },
      style
  ]}>
    {showSelect
    ?<TouchableOpacity onPress={() => toggleSelect(title)}>  
      <View>
        <FontAwesome name={selected?"circle":"circle-o"} size={20} color={colors.placeholder} style={{marginRight: 5}}/>
      </View>
    </TouchableOpacity>
    :<View/>}
      <View style={{justifyContent: 'center'}}>
          {text !== "" && text !== "00:00" && text !== 0 ? <Text style={{...styles.title, color: colors.text}}>{title}</Text> : <View/>}
          <Text style={{...styles.text, color: colors.text}}>
            {text === 0 || text === "00:00" || text === "" ? title : text.toString()} 
          </Text>
      </View>
      <View style={styles.rightComponent}>
          {children}
      </View>
    </View>
  );
}

const RowItem = ({title, text, onPress, children, style, showSelect, selected, toggleSelect}) => {
  if (onPress) {
    return (
      <TouchableHighlight
        onPress={showSelect?() => toggleSelect(title):onPress}
      >
        <Row title={title} text={text} children={children} style={style} showSelect={showSelect} selected={selected} toggleSelect={toggleSelect}/>
      </TouchableHighlight>
    );
  }
  return (
    <Row title={title} text={text} children={children} style={style} showSelect={showSelect} selected={selected} toggleSelect={toggleSelect}/>
  );
};

export default RowItem;

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
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  rightComponent: {
    flexGrow: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});