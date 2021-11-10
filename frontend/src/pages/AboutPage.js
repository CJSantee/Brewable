import React from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import Header from '../components/Header';

function AboutPage({ navigation }) {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <Header title="About" leftText="Back" leftChevron={true} leftOnPress={() => navigation.goBack()}/>
            <View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center', marginHorizontal: 15 }}>
                <View style={styles.block}>
                    <Text style={{...styles.title, color: colors.text}}>Developer</Text>
                    <Text style={{...styles.subtitle, color: colors.text}}>Colin Santee</Text>
                </View>
                <View style={styles.block}>
                    <Text style={{...styles.title, color: colors.text}}>Research</Text>
                    <Text style={{...styles.subtitle, color: colors.text}}>Madelyne Brooks</Text>
                </View>
                <View style={styles.block}>
                    <Text style={{...styles.title, color: colors.text}}>Beta Testers</Text>
                    <Text style={{fontSize: 14, color: colors.text}}>Thomas Clawson, Jeremiah Niehls, Christopher Schneider, Johnathan Sottek</Text>
                </View>
            </View>
        </View> 
    );
}

export default AboutPage;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    block: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 18,
        margin: 2
    },
    subtitle: {
        fontSize: 18
    }
});