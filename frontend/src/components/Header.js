import React from 'react';
import {
    View, 
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Constants from "expo-constants";
import { useTheme } from '@react-navigation/native';

const Header = ({title, leftText, rightText, leftOnPress, rightOnPress, leftChevron, rightChevrom}) => {
    const {colors} = useTheme();

    return (
        <View style={{...styles.header, backgroundColor: colors.card}}>  
            <TouchableOpacity style={{...styles.left, left: leftChevron ? 10 : 15}} onPress={leftOnPress}>
                {leftChevron ? <FontAwesomeIcon icon={faChevronLeft} size={16} color={colors.interactive}/> : <View/>}
                <Text style={{...styles.text, color: colors.interactive}}>{leftText}</Text>
            </TouchableOpacity>
            <Text style={{...styles.title, color: colors.text}}>{title}</Text>
            <TouchableOpacity style={{...styles.right, right: rightChevrom ? 10 : 15}} onPress={rightOnPress}>
                {rightChevrom ? <FontAwesomeIcon icon={faChevronRight} size={16} color={colors.interactive}/> : <View/>}
                <Text style={{...styles.text, color: colors.interactive}}>{rightText}</Text>
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
        justifyContent: 'center',
        paddingHorizontal: 15,
        borderColor: "rgb(201, 210, 217)",
        borderBottomWidth: 1
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    text: {
        fontSize: 16,
    },
    left: {
        position: 'absolute',
        height: "100%",
        marginTop: Constants.statusBarHeight,
        top: 0,
        left: 15,
        marginRight: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    right: {
        position: 'absolute',
        height: "100%",
        marginTop: Constants.statusBarHeight,
        top: 0,
        right: 15,
        marginLeft: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
})