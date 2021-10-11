import React from 'react';
import {
    View, 
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import Constants from "expo-constants";
import { useTheme } from '@react-navigation/native';

let {height, width} = Dimensions.get('window');

const Header = ({title, leftText, rightText, leftOnPress, rightOnPress}) => {
    const {colors} = useTheme();

    return (
        <View style={{...styles.header, backgroundColor: colors.card}}>  
            <TouchableOpacity style={styles.left} onPress={leftOnPress}>
                <Text style={{...styles.text, color: colors.text}}>{leftText}</Text>
            </TouchableOpacity>
            <Text style={{...styles.title, color: colors.text}}>{title}</Text>
            <TouchableOpacity style={styles.right} onPress={rightOnPress}>
                <Text style={{...styles.text, color: colors.text}}>{rightText}</Text>
            </TouchableOpacity>
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
        paddingHorizontal: 5,
        borderColor: "rgb(201, 210, 217)",
        borderBottomWidth: 1
    },
    title: {
        fontSize: 18,
    },
    text: {
        fontSize: 16
    },
    left: {
        width: "20%",
        height: "100%",
        marginRight: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    right: {
        width: "20%",
        height: "100%",
        marginLeft: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
})