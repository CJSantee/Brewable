import React, { useState } from 'react';
import {
    View, 
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Feather, FontAwesome } from '@expo/vector-icons';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
    const { colors } = useTheme();

    return (
        <View style={{...styles.bar, backgroundColor: colors.card, borderColor: colors.border}}>
            <View style={{...styles.input, backgroundColor: colors.background, borderColor: colors.border}} >
                <Feather style={{marginHorizontal: 10}} name="search" size={18} color={colors.placeholder}/>
                <TextInput   
                    style={{width: "85%", color: colors.text}}
                    value={searchQuery} 
                    onChangeText={setSearchQuery}
                />
                {searchQuery!==""
                    ?<TouchableOpacity style={styles.cancel} onPress={() => setSearchQuery("")}>
                        <FontAwesome name="times-circle" size={18} color={colors.placeholder}/>
                    </TouchableOpacity>
                    :<View/>}
            </View>  
        </View>
    );
}

export default SearchBar;

const styles = StyleSheet.create({
    bar: {
        borderBottomWidth: 0,
    }, 
    input: {
        height: 30,
        margin: 10,
        borderRadius: 15,
        borderWidth: 1,
        alignItems: 'center',
        flexDirection: 'row'
    },
    cancel: {
        position: 'absolute',
        width: 25,
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5, 
        right: 0, 
    }
});