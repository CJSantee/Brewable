import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Constants from "expo-constants";

let {height, width} = Dimensions.get('window');

const HomePage = ({navigation}) => {
    const {colors} = useTheme();
    const [button, setButton] = useState({open: false});

    return (
        <View style={{flex: 1, flexDirection: 'column' }}>  
            <View style={styles.header}>
                <View style={styles.searchBar}>

                </View>
                <View style={styles.button}>
                    <TouchableOpacity onPress={() => navigation.navigate("New Brew")}>
                        <FontAwesomeIcon icon={faPlus} size={30}/>
                    </TouchableOpacity>
                </View>
            </View>
            
        </View>
    );
};

export default HomePage;

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#c9b79c",
        width: "100%",
        height: 80,
        paddingTop: Constants.statusBarHeight,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    searchBar: {
        backgroundColor: "#696969",
        flex: 4,
        height: "60%",
        borderRadius: 40,
    },
    button: {
        backgroundColor: "#71816d",
        flex: 1, 
        height: "60%",
        borderRadius: 40, 
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
    }
});