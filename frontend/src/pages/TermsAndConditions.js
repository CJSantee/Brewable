import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import Header from '../components/Header';
import { accuracyOfInformation, additionalTermsAndConditions, contractTerms, copyright, craftCoffeeServiceOverview, disclaimerOfWarranty, indemnification, intellectualPropertyRights, limitationOfLiability, personalData, prohibitedUses, termsAndConditions, userContent } from '../utils/LegalText';

function TermsAndConditions({ navigation }) {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <Header title="Legal" leftText="Back" leftChevron={true} leftOnPress={() => navigation.goBack()}/>
            <ScrollView>
                <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', marginHorizontal: 15, paddingBottom: 35}}>
                    <Text style={{...styles.title, color: colors.text}}>Terms and Conditions</Text>
                    <Text style={{...styles.text, color: colors.text}}>{termsAndConditions}</Text>
                    <Text style={{...styles.heading, color: colors.text}}>Additional terms and conditions</Text>
                    <Text style={{...styles.text, color: colors.text}}>{additionalTermsAndConditions}</Text>
                    <Text style={{...styles.heading, color: colors.text}}>Copyright</Text>
                    <Text style={{...styles.text, color: colors.text}}>{copyright}</Text>
                    <Text style={{...styles.heading, color: colors.text}}>User content</Text>
                    <Text style={{...styles.text, color: colors.text}}>{userContent}</Text>
                    <Text style={{...styles.heading, color: colors.text}}>Accuracy of information</Text>
                    <Text style={{...styles.text, color: colors.text}}>{accuracyOfInformation}</Text>
                    <Text style={{...styles.heading, color: colors.text}}>Craft Coffee service overview</Text>
                    <Text style={{...styles.text, color: colors.text}}>{craftCoffeeServiceOverview}</Text>
                    <Text style={{...styles.heading, color: colors.text}}>Contract Terms</Text>
                    <Text style={{...styles.text, color: colors.text}}>{contractTerms}</Text>
                    <Text style={{...styles.heading, color: colors.text}}>Prohibited uses</Text>
                    <Text style={{...styles.text, color: colors.text}}>{prohibitedUses}</Text>
                    <Text style={{...styles.heading, color: colors.text}}>Intellectual property rights</Text>
                    <Text style={{...styles.text, color: colors.text}}>{intellectualPropertyRights}</Text>
                    <Text style={{...styles.heading, color: colors.text}}>Personal Data</Text>
                    <Text style={{...styles.text, color: colors.text}}>{personalData}</Text>
                    <Text style={{...styles.heading, color: colors.text}}>Disclaimer of warranty</Text>
                    <Text style={{...styles.text, color: colors.text}}>{disclaimerOfWarranty}</Text>
                    <Text style={{...styles.heading, color: colors.text}}>Limitation of liability</Text>
                    <Text style={{...styles.text, color: colors.text}}>{limitationOfLiability}</Text>
                    <Text style={{...styles.heading, color: colors.text}}>Indemnification</Text>
                    <Text style={{...styles.text, color: colors.text}}>{indemnification}</Text>
                </View>
            </ScrollView>
        </View> 
    );
}

export default TermsAndConditions;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 15
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 10
    },
    text: {
        fontSize: 14
    }
});