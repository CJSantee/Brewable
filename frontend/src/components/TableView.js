import { useTheme } from '@react-navigation/native';
import React from 'react';
import {
    View,
    StyleSheet,
    Text
} from 'react-native'

const TableViewHeader = ({header, style}) => {
    const {colors} = useTheme();

    return (
        <View style={[
            styles.header,
            { backgroundColor: colors.background },
            style
        ]}>
            <Text style={{color: colors.placeholder}}>{header.toUpperCase()}</Text>
        </View>
    );
};

const TableView = ({ header, headerStyle, children }) => {
    return (
        <View>
            {header ? <TableViewHeader header={header} style={headerStyle}/> : <View/>}
            {children}
        </View>
    );
};

export default TableView;

const styles = StyleSheet.create({
    header: {
        paddingTop: 15,
        paddingHorizontal: 15,
        paddingBottom: 7,
    },
});
  