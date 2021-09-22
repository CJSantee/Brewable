import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import { CustomTheme } from '../Themes';
import Constants from "expo-constants";

const ProfilePage = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Test</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: CustomTheme.colors.background, 
        marginTop: Constants.statusBarHeight
    },
    text: {
        color: CustomTheme.colors.text
    }
})

export default ProfilePage;