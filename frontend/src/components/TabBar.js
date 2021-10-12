import React from 'react';
import {
    View, 
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Constants from "expo-constants";
import { useTheme } from '@react-navigation/native';

import CoffeeBean from '../../assets/coffeeBean.svg';

const TabBar = ({ navigation }) => {
    const {colors} = useTheme();

    return (
        <View style={{...styles.footer, backgroundColor: colors.card, borderColor: colors.border}}>  
            <TouchableOpacity style={styles.tab}>
                <CoffeeBean width={35} height={35} style={{color: colors.text}}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                <FontAwesomeIcon icon={faUserCircle} size={35}/>
            </TouchableOpacity>
        </View>
    );
};

export default TabBar;

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        bottom: 0,
        height: "10%",
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingHorizontal: 15,
        borderTopWidth: 1
    },
    tab: {

    }
})