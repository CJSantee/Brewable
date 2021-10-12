import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import Constants from "expo-constants";

const ProfilePage = () => {
    return (
        <View style={styles.container}>
            <Text>Test</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        marginTop: Constants.statusBarHeight
    }
})

export default ProfilePage;