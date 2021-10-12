import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView
} from 'react-native';
import { useTheme } from '@react-navigation/native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import TableView from './components/TableView';
import RowItem from './components/RowItem';
import Header from './components/Header';


const BrewMethods = ({ route, navigation }) => {
    const { selected } = route.params;
    const { colors } = useTheme();

    return (
        <View style={{height: "100%", width: "100%"}}>  
            <Header title="Brew Method" leftText="Back" leftOnPress={() => navigation.goBack()} leftChevron={true}/>
            <ScrollView style={{...styles.container, backgroundColor: colors.background}}>
                <RowItem
                    title="V60"
                    text=""
                    onPress={() => { navigation.navigate("main", {method: "V60"}); }}
                >
                    {selected === "V60" ? <FontAwesomeIcon icon={faCheck} size={20} color={colors.primary}/> : <View/>}
                </RowItem>
                <RowItem
                    title="French Press"
                    text=""
                    onPress={() => { navigation.navigate("main", {method: "French Press"}); }}
                >
                    {selected === "French Press" ? <FontAwesomeIcon icon={faCheck} size={20} color={colors.primary}/> : <View/>}
                </RowItem>
                <RowItem
                    title="Aeropress"
                    text=""
                    onPress={() => { navigation.navigate("main", {method: "Aeropress"}); }}
                >
                    {selected === "Aeropress" ? <FontAwesomeIcon icon={faCheck} size={20} color={colors.primary}/> : <View/>}
                </RowItem>
            </ScrollView>
        </View>
    );
}

export default BrewMethods;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
    }
});