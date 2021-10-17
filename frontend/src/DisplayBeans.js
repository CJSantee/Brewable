import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useTheme, useFocusEffect } from '@react-navigation/native';

import Header from './components/Header';
import Brew from './Brew';

// Open SQLite Database
function openDatabase() {
    const db = SQLite.openDatabase("CoffeeLab.db");
    return db;
}
  
const db = openDatabase();

const DisplayBeans = ({ route, navigation }) => {
    const [beans, setBeans] = useState({region: "", roaster: "", origin: "", roast_level: "", roast_date: new Date(), price: 0, weight: 0, weight_unit: "g"}); // Beans state
    const [brews, setBrews] = useState([]); // Array of brews for given beans
    const [flavorNotes, setFlavorNotes] = useState([]);
    const { beans_id } = route.params; // Beans_id for which beans to display
    const {colors} = useTheme(); // Color theme

    const options = { weekdate: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    function roastDate() {
        if (beans.roast_date === "") return "";
        let date = new Date(beans.roast_date);
        return date.toLocaleDateString('en-US', options);
    }

    useEffect(() => {
        if (beans.flavor_notes !== undefined)
            setFlavorNotes(beans.flavor_notes.split(','));
    }, [beans]);

    // Retrieve beans and associated brews from database on mounted
    useFocusEffect(
        useCallback(()=> {
            let mounted = true;
            db.transaction(
                (tx) => {
                    tx.executeSql(
                        `SELECT * 
                        FROM beans 
                        WHERE id = ?;`,
                        [beans_id],
                        (_, { rows: { _array } }) => {
                            if (mounted) setBeans(_array[0]);
                        }
                    );
                    tx.executeSql(
                        "SELECT * FROM brews WHERE beans_id = ?;",
                        [beans_id],
                        (_, { rows: { _array } }) => {
                            if (mounted) setBrews(_array);
                        }
                    );
                },
                (e) => console.log(e), null
            );
            return () => mounted= false;
        }, [beans, brews])
    );

    return (
        <View style={{...styles.container, backgroundColor: colors.background}}>
            <Header 
                title="Beans" 
                leftText="Back" rightText="Edit" 
                leftOnPress={() => navigation.goBack()} 
                rightOnPress={() => navigation.navigate("EditBeans", {beans: beans, flavor_notes: beans.flavor_notes})}/>
            <View style={styles.row}>
                <Text style={styles.title}>{beans.roaster} </Text>
                <Text style={styles.subtitle}>{beans.region}</Text>
            </View>
            <View style={styles.row}>
                {roastDate()!==""?<Text style={{fontSize: 18}}>{roastDate()}</Text>:<View/>}
                <Text style={{fontSize: 18}}> - {beans.weight}{beans.weight_unit}</Text>
            </View>
            <View style={styles.row}>
                <Text>{beans.origin}</Text>
            </View>
            <View style={styles.flavors}>
                {flavorNotes.map((item) => 
                    <View key={item } style={styles.flavor}>
                        <Text style={styles.flavorText}>{item}</Text>
                    </View>
                )}
            </View>
            <View style={styles.col}>
                <Text style={{fontSize: 14, color: colors.placeholder}}>{brews.length === 0?"No Brews":"- Brews -"}</Text>
                <FlatList
                    data={brews}
                    style={{alignSelf: 'center'}}
                    horizontal={false}
                    renderItem={(item) => <Brew brew={item.item} navigation={navigation}/>}
                    keyExtractor={item => item.id.toString()}
                />
            </View>
        </View>
    );
}

export default DisplayBeans;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 5,
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    col: {
        flexDirection: 'column',
        marginHorizontal: 10,
        marginVertical: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 22,
    },
    subtitle: {
        fontSize: 22,
    },
    flavors: {
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },  
    flavor: {
        display: 'flex',
        marginHorizontal: 10,
        marginBottom: 15,
        borderWidth: 1,
        padding: 10,
        borderRadius: 15
    },
    flavorText: {
        fontSize: 16
    }
});