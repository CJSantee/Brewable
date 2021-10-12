import { useTheme } from '@react-navigation/native';
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight
} from 'react-native';

const Row = ({title, text, children, style}) => {
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
      },
      style
  ]}>
      <View style={{justifyContent: 'center'}}>
          {text !== "" && text !== "00:00" && text !== 0 ? <Text style={styles.title}>{title}</Text> : <View/>}
          <Text style={styles.text}>
            {text === 0 || text === "00:00" || text === "" ? title : text.toString()} 
          </Text>
      </View>
      <View style={styles.rightComponent}>
          {children}
      </View>
    </View>
  );
}

const RowItem = ({title, text, onPress, children, style}) => {
  if (onPress) {
    return (
      <TouchableHighlight
        onPress={onPress}
      >
        <Row title={title} text={text} children={children} style={style}/>
      </TouchableHighlight>
    );
  }
  return (
    <Row title={title} text={text} children={children} style={style}/>
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
    justifyContent: 'flex-end'
  },
});