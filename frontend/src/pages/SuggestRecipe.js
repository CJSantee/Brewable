import React, { useState, useCallback } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Text, 
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { suggestRecipe } from '../utils/SmartRecipes';
import { Entypo, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import CoffeeBean from '../../assets/icons/coffeeBean.svg';
import CoffeeGrounds from '../../assets/icons/coffeeGrounds.svg';

let {height, width} = Dimensions.get('window');

import Header from '../components/Header';
import TableView from '../components/TableView';
import RowItem from '../components/RowItem';
import TastingWheel from '../components/TastingWheel';
import RecipeRow from '../components/RecipeRow';

/*
    TODO: Add Notes to suggestions
*/

function SuggestRecipe({ route, navigation }) {
    const { colors } = useTheme();
    const { issueUid, brew } = route.params;
    const [newBrew, setNewBrew] = useState(brew);

    const values = [brew.body, brew.aftertaste, brew.sweetness, brew.aroma, brew.flavor, brew.acidity];

    useFocusEffect(
        useCallback(() => {
            setNewBrew(suggestRecipe(issueUid, brew));
        }, [])
    );

    return (
        <View style={styles.container}>
            <Header title="Recipe Suggestions" leftText="Back" leftChevron={true} leftOnPress={() => navigation.goBack()}/>
            <ScrollView>
                <TableView header="Old">
                    <RecipeRow brew={brew}/>
                </TableView>
                <View style={{width: '100%', alignItems: 'center'}}>
                    <View style={{width: width/1.5, height: width/1.5}}>
                        <TastingWheel style={styles.wheel} displayText={true} width={width/1.5} height={width/1.5} values={values} />
                    </View>
                </View>
                <TableView 
                    header="New" 
                    leftOnPress={() => navigation.navigate("NewBrew", { parent: "SuggestRecipe" })}
                    rightChildren={
                        <TouchableOpacity onPress={() => navigation.navigate("NewBrew", { parent: "SuggestRecipe", brew: newBrew })}>
                            <Text style={{ fontSize: 12, color: colors.interactive }}>ADD BREW</Text>
                        </TouchableOpacity>}
                >
                    <RecipeRow brew={newBrew}/>
                    {(newBrew.notes !== "") &&
                    <View style={{marginHorizontal: 10}}>
                        <Text style={{color: colors.text}}>{newBrew.notes}</Text>
                    </View>}
                </TableView>
                <View style={{width: '100%', alignItems: 'center'}}>
                    <View style={{width: width/1.5, height: width/1.5}}>
                        <TastingWheel style={styles.wheel} displayText={true} width={width/1.5} height={width/1.5} values={values} altValues={[newBrew.body, newBrew.aftertaste, newBrew.sweetness, newBrew.aroma, newBrew.flavor, newBrew.acidity]} />
                    </View>
                </View>
            </ScrollView> 
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
        fontSize: 16,
        marginLeft: 5
    },
});