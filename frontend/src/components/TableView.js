import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native'
import { useTheme } from '@react-navigation/native';

const TableViewHeader = ({header, style, rightChildren}) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.header,
            { 
                backgroundColor: colors.background 
            },
            style
        ]}>
            <Text style={{color: colors.placeholder}}>{header.toUpperCase()}</Text>
            {rightChildren}
        </View>
    );
};

const TableView = ({ header, headerStyle, style, children, rightChildren }) => {
    return (
        <View style={style}>
            {header ? <TableViewHeader header={header} style={headerStyle} rightChildren={rightChildren} /> : <View/>}
            {children}
        </View>
    );
}

export default TableView;

const styles = StyleSheet.create({
    header: {
        paddingTop: 15,
        paddingHorizontal: 15,
        paddingBottom: 7,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
});
  