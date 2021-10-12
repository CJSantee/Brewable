import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import Constants from "expo-constants";

import Header from './components/Header';

const ProfilePage = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Header title="Profile" leftText="Back" leftChevron={true} leftOnPress={() => navigation.goBack()}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
    }
})

export default ProfilePage;