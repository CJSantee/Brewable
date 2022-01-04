import React from 'react';
import {
    View,
    StyleSheet,
    Alert,
    Text,
    TouchableOpacity
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import Header from '../components/Header';

function AboutPage({ navigation }) {
    const { colors } = useTheme();

    const loginPartners = () => {
        Alert.prompt(
            "Enter Password",
            "",
            [
                {
                    text: "Cancel",
                    onPress: () => {}
                },
                {
                    text: "Confirm",
                    onPress: (value) => {
                        if (value === "iLoveCoffee") {
                            navigation.navigate("DeveloperPage");
                        } else {
                            Alert.alert("Incorrect Password");
                        }
                    }
                }
            ]
        )
    }

    return (
        <View style={styles.container}>
            <Header title="About" leftText="Back" leftChevron={true} leftOnPress={() => navigation.goBack()}/>
            <View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center', marginHorizontal: 15 }}>
                <View style={styles.block}>
                    <Text style={{...styles.title, color: colors.text}}>Developer</Text>
                    <Text style={{...styles.subtitle, color: colors.text}}>Colin Santee</Text>
                </View>
                <TouchableOpacity onPress={loginPartners}>
                <View style={styles.block}>
                    <Text style={{...styles.title, color: colors.text}}>Beta Testers</Text>
                    <Text style={{...styles.subtitle, color: colors.text}}>{`Jeremiah Niehls\nChristopher Schneider\nJohnathan Sottek`}</Text>
                </View>
                </TouchableOpacity>
                <View style={styles.block}>
                    <Text style={{...styles.title, color: colors.text}}>Special Thanks</Text>
                    <Text style={{...styles.subtitle, color: colors.text}}>Madelyne Brooks</Text>
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
        fontSize: 17,
        fontWeight: 'bold',
        margin: 2
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center'
    }
});