import React, { useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native';

const Brew = ({brew, onFavorite, onDelete}) => {
    return (
        <TouchableOpacity onPress={() => onDelete(brew.id)}>
            <View style={styles.brew}>  
                    <Text style={styles.text}>{brew.favorite}</Text>
            </View>
        </TouchableOpacity>
    );
}

const FlatListTest = () => {
    const [brews, setBrews] = useState([
        {
            id: 1,
            favorite: 0
        },
        {
            id: 2,
            favorite: 1
        },
        {
            id: 3,
            favorite: 1
        },
        {
            id: 4,
            favorite: 1
        }
    ])

    const onFavorite = (id) => {
        setBrews(brews.map(brew => brew.id===id?{...brew, favorite: brew.favorite===0?1:0}:brew));
    }
    const onDelete = (id) => {
        setBrews(brews.filter(brew => brew.id !== id));
    }

    return (
        <View style={styles.container}>  
            <FlatList
                data={brews}
                renderItem={({item}) => <Brew brew={item} onFavorite={onFavorite} onDelete={onDelete}/>}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>  
    );
}

export default FlatListTest;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50
    },
    brew: {
        width: "100%",
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        borderWidth: 1
    },
    text: {
        fontWeight: 'bold',
        fontSize: 24
    }
});