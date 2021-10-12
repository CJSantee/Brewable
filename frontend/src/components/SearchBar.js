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

const SearchBar = () => {
    const [text, setText] = useState("");
    const { colors } = useTheme();

    return (
        <View style={{...styles.bar, backgroundColor: colors.card, borderColor: colors.border}}>
            <View style={{...styles.input, backgroundColor: colors.background, borderColor: colors.border}} >
                <FontAwesomeIcon style={{marginHorizontal: 5}} icon={faSearch}/>
                <TextInput   
                    style={{width: "85%"}}
                    value={text} 
                    onChangeText={setText}
                />
                {text!==""
                    ?<FontAwesomeIcon icon={faTimesCircle} size={18} style={styles.cancel} onPress={() => setText("")}/>
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
        marginHorizontal: 5, 
        right: 0, 
    }
});