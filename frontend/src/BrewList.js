import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTint, faFire, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import CoffeeBean from '../assets/coffeeBean.svg';
// import { SvgXml } from 'react-native-svg';
import TastingWheel from './components/TastingWheel';

function openDatabase() {
    const db = SQLite.openDatabase("CoffeeLab.db");
    return db;
}
  
const db = openDatabase();

const Brew = ({ brew, navigation }) => {
    const {colors} = useTheme();
    const options = { weekdate: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    var brew_date = new Date(brew.date);
    let date_string = brew_date.toLocaleDateString('en-US', options);

    return (
        <TouchableWithoutFeedback onPress={() => navigation.navigate("Brew", {brew_id: brew.id})}>
        <View style={{...styles.brew, backgroundColor: colors.card}}>
            <View style={styles.cardItem}>
                <Text style={{fontWeight: 'bold', fontSize: 18}}>{brew.brew_method}</Text>
            </View>
            <View style={styles.cardItem}>
                <FontAwesomeIcon size={20} icon={faTint}/>
                <Text style={styles.value}>{brew.water}</Text>
                <Text>{brew.water_unit}</Text>
            </View>
            <View style={styles.cardItem}>
                <CoffeeBean width={20} height={20}/>
                <Text style={styles.value}>{brew.coffee}</Text>
                <Text>{brew.coffee_unit}</Text>
            </View>
            <View style={styles.cardItem}>
                <FontAwesomeIcon size={20} icon={faFire}/>
                <Text style={styles.value}>{brew.temperature}</Text>
                <Text>°{brew.temp_unit}</Text>
            </View>
            <View style={styles.cardItem}>
                <FontAwesomeIcon size={20} icon={faStopwatch}/>
            </View>
            <View style={styles.notes}>
                <Text>{brew.notes}</Text>
            </View>
            <TastingWheel style={styles.wheel} displayText={false} width="125" height="125" values={[brew.body*20, brew.aftertaste*20, brew.sweetness*20, brew.aroma*20, brew.flavor*20, brew.acidity*20]}/>
            <Text style={{position: 'absolute', bottom: 8, right: 12}}>{date_string}</Text>
        </View>
        </TouchableWithoutFeedback>
    );
}

const BrewList = ({beans, navigation}) => {
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
            <TouchableOpacity onPress={() => navigation.navigate("Beans", {beans_id: beans.id})}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.title}>{beans.roaster} </Text>
                    <Text style={styles.subtitle}>{beans.region}</Text>
                </View>
            </TouchableOpacity>
            <FlatList
                data={brews}
                horizontal={true}
                renderItem={(item) => <Brew brew={item.item} navigation={navigation}/>}
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
    },
    wheel: {
        width: "100%",
        height: "100%",
        position: 'absolute',
        top: -10,
        right: -5,
        alignItems: 'flex-end',
    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        marginLeft: 2,
        marginRight: 1,
    },
    notes: {
        overflow: 'hidden',
        width: "55%",
    }
});