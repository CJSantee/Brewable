import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { useTheme } from '@react-navigation/native';

// Component Imports
import Header from '../components/Header';

import { acidity, aftertaste, aroma, body, flavor, sweetness } from '../Descriptions';

const InfoPage = ({ route, navigation }) => {
    const { topic } = route.params; // Topic to display info on 
    const { colors } = useTheme(); // Color theme

    let description;
    switch (topic) {
        case 'Flavor':
            description = flavor;
            break;
        case 'Acidity':
            description = acidity;
            break;
        case 'Aroma':
            description = aroma;
            break;
        case 'Body':
            description = body;
            break;
        case 'Sweetness':
            description = sweetness;
            break;
        case 'Aftertaste':
            description = aftertaste;
            break;
        default: 
            description = "";
    }

    return (
        <View style={styles.container}>
            <Header title="About" leftText="Back" leftOnPress={() => navigation.goBack()} leftChevron={true}/>
            <View style={{...styles.card, backgroundColor: colors.card}}>
                <Text style={styles.title}>{topic}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
        </View>
    );
}

export default InfoPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        flex: 1,
        margin: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgb(201, 210, 217)",
        alignItems: 'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 22,
        margin: 5
    },
    description: {
        fontSize: 16,
        marginHorizontal: 15
    }
});