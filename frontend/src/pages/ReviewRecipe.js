import React, { useCallback, useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Text,
    Dimensions,
    FlatList
} from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { Feather, Entypo, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import CoffeeBean from '../../assets/icons/coffeeBean.svg';

let {height, width} = Dimensions.get('window');

import Header from '../components/Header';
import TableView from '../components/TableView';
import RowItem from '../components/RowItem';
import TastingWheel from '../components/TastingWheel';
import { suggestIssues } from '../utils/SmartRecipes';

function ReviewRecipe({ route, navigation }) {
    const { colors } = useTheme();
    const { brew } = route.params;
    const [issues, setIssues] = useState([]);

    function getHeaderIndices() {
        let ret = [];
        issues.forEach((issue, index) => {
            if (issue.subtitle === "header")
                ret.push(index);
        });
        return ret;
    }

    useFocusEffect(
        useCallback(() => {
            setIssues(suggestIssues(brew));
        }, [])
    );

    const renderItem = useCallback(
        ({item, index}) => item.subtitle==="header"?<TableView header={item.title}/>:
        (<RowItem title={item.title+" "+item.subtitle} text="" onPress={() => navigation.navigate("SuggestRecipe", { brew: brew, issueUid: item.uid })}>
            <Feather name="chevron-right" size={16} color={colors.placeholder}/>
        </RowItem>), []
    );

    const keyExtractor = useCallback((item) => item.uid, []);

    return (
        <View style={styles.container}>
            <Header title="Review Recipe" leftText="Back" leftChevron={true} leftOnPress={() => navigation.goBack()}/>
            <View style={{width: '100%', alignItems: 'center'}}>
                <View style={{width: width/2, height: width/2}}>
                    <TastingWheel style={styles.wheel} displayText={true} width={width/2} height={width/2} values={[brew.body, brew.aftertaste, brew.sweetness, brew.aroma, brew.flavor, brew.acidity]} />
                </View>
            </View>
            <FlatList 
                data={issues}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                stickyHeaderIndices={getHeaderIndices()}
            />
        </View> 
    );
}

export default ReviewRecipe;

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
    wheel: {
        width: '100%',
        height: '100%',
    }
});