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
                <FontAwesomeIcon style={{marginHorizontal: 5}} icon={faSearch}/>
                <TextInput   
                    style={{width: "85%"}}
                    value={searchQuery} 
                    onChangeText={setSearchQuery}
                />
                {searchQuery!==""
                    ?<TouchableOpacity style={styles.cancel} onPress={() => setSearchQuery("")}>
                        <FontAwesomeIcon icon={faTimesCircle} size={18}/>
                    </TouchableOpacity>
                    :<View/>}
            </View>  
            
        </View>
    );
}

export default SearchBar;

const styles = StyleSheet.create({
    bar: {
        borderBottomWidth: 1,
    }, 
    input: {
        height: 30,
        margin: 10,
        borderRadius: 5,
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