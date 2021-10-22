import React, { useState } from 'react';
import {
    View, 
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
    const { colors } = useTheme();

    return (
        <View style={{...styles.bar, backgroundColor: colors.card, borderColor: colors.border}}>
            <View style={{...styles.input, backgroundColor: colors.background, borderColor: colors.border}} >
                <FontAwesomeIcon style={{marginHorizontal: 10}} icon={faSearch} color={colors.placeholder}/>
                <TextInput   
                    style={{width: "85%"}}
                    value={searchQuery} 
                    onChangeText={setSearchQuery}
                />
                {searchQuery!==""
                    ?<TouchableOpacity style={styles.cancel} onPress={() => setSearchQuery("")}>
                        <FontAwesomeIcon icon={faTimesCircle} size={18} color={colors.placeholder}/>
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
        borderRadius: 10,
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