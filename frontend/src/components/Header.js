import React from 'react';
import {
    View, 
    StyleSheet,
    Text,
    Button
} from 'react-native';
import Constants from "expo-constants";
import { useTheme } from '@react-navigation/native';

const Header = ({title, leftText, rightText, leftOnPress, rightOnPress}) => {
    const {colors} = useTheme();

    return (
        <View style={{...styles.header, backgroundColor: colors.card}}>  
            <Button title={leftText} onPress={leftOnPress}/>
            <Text style={styles.title}>{title}</Text>
            <Button title={rightText} onPress={rightOnPress}/>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        paddingTop: Constants.statusBarHeight,
        height: "12%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 5
    },
    title: {
        fontSize: 18,
    }
})