import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTint, faFire, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import Beans from '../assets/coffeeBeans.svg';
import TastingWheel from './components/TastingWheel';

function openDatabase() {
    const db = SQLite.openDatabase("CoffeeLab.db");
    return db;
}
  
const db = openDatabase();

const Brew = ({ brew }) => {
    const {colors} = useTheme();

    return (
        <View style={{...styles.brew, backgroundColor: colors.card}}>
            <Text>Test</Text>
            <TastingWheel style={styles.wheel} displayText={true} values={[brew.body*20, brew.aftertaste*20, brew.sweetness*20, brew.aroma*20, brew.flavor*20, brew.acidity*20]}/>
        </View>
    );
}

const BrewList = ({beans}) => {
    const [brews, setBrews] = useState([]);

    const readBrews = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM brews WHERE beans_id = ?;",
                [beans.id],
                (_, { rows: { _array } }) =>
                setBrews(_array)
            );
        },
        (e) => console.log(e),
        null);
    }

    useFocusEffect(
        useCallback(()=> {
            readBrews();
            return () => {};
        }, [])
    );

    return (
        <View style={styles.beans}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.title}>{beans.roaster} </Text>
                <Text style={styles.subtitle}>{beans.region}</Text>
            </View>
            <FlatList
                data={brews}
                horizontal={true}
                renderItem={(item) => <Brew brew={item.item}/>}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}

export default BrewList;

const styles = StyleSheet.create({
    beans: {
        margin: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 18,
    },
    brew: {
        marginTop: 5,
        marginRight: 10,
        borderWidth: 0.5,
        borderColor: "rgb(201, 210, 217)",
        width: 300,
        height: 200,
        borderRadius: 10,
        padding: 5,
        flexDirection: 'row'
    },
    wheel: {
        width: "100%",
        height: "100%",
        position: 'absolute',
        top: 10,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    }
});