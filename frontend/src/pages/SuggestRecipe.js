import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Text
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Feather, Entypo, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import CoffeeBean from '../../assets/icons/coffeeBean.svg';

import Header from '../components/Header';
import TableView from '../components/TableView';
import RowItem from '../components/RowItem';

function SuggestRecipe({ route, navigation }) {
    const { colors } = useTheme();
    const { brew } = route.params;

    return (
        <View style={styles.container}>
            <Header title="Recipe Suggestions" leftText="Back" leftChevron={true} leftOnPress={() => navigation.goBack()}/>
            <TableView header="Old">
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 10}}>
                    <View style={styles.item}>
                        <Entypo name="water" size={25} color="#0069A7"/>
                        <Text style={{...styles.value, color: colors.text}}>{brew.water}</Text>
                        <Text style={{color: colors.text}}>{brew.water_unit}</Text>
                    </View>
                    <View style={styles.item}>
                        <CoffeeBean width={25} height={25} style={{color: "#714B33"}}/>
                        <Text style={{...styles.value, color: colors.text}}>{brew.coffee}</Text>
                        <Text style={{color: colors.text}}>{brew.coffee_unit}</Text>
                    </View>
                    <View style={styles.item}>
                        <FontAwesome5 size={25} name="fire" color="#EB811E"/>
                        <Text style={{...styles.value, color: colors.text}}>{brew.temperature}°</Text>
                        <Text style={{color: colors.text}}>{brew.temp_unit}</Text>
                    </View>
                    <View style={styles.item}>
                        <MaterialCommunityIcons name="timer" size={25} color="#4D814B"/>
                        <Text style={{...styles.value, color: colors.text}}>{brew.time}</Text>
                    </View>
                </View>
            </TableView>
            <TableView header="New">
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 10}}>
                    <View style={styles.item}>
                        <Entypo name="water" size={25} color="#0069A7"/>
                        <Text style={{...styles.value, color: colors.text}}>{brew.water}</Text>
                        <Text style={{color: colors.text}}>{brew.water_unit}</Text>
                    </View>
                    <View style={styles.item}>
                        <CoffeeBean width={25} height={25} style={{color: "#714B33"}}/>
                        <Text style={{...styles.value, color: colors.text}}>{brew.coffee}</Text>
                        <Text style={{color: colors.text}}>{brew.coffee_unit}</Text>
                    </View>
                    <View style={styles.item}>
                        <FontAwesome5 size={25} name="fire" color="#EB811E"/>
                        <Text style={{...styles.value, color: colors.text}}>{brew.temperature}°</Text>
                        <Text style={{color: colors.text}}>{brew.temp_unit}</Text>
                    </View>
                    <View style={styles.item}>
                        <MaterialCommunityIcons name="timer" size={25} color="#4D814B"/>
                        <Text style={{...styles.value, color: colors.text}}>{brew.time}</Text>
                    </View>
                </View>
            </TableView>
        </View> 
    );
}

export default SuggestRecipe;

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
    },
    item: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 5,
        alignItems: 'center'
    },
    value: {
        fontSize: 18,
        marginLeft: 5
    },
});