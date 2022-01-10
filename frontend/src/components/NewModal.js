import React from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import RowItem from './RowItem';

export default function NewModal({ navigation }) {
    const {colors} = useTheme();

    return (
        <View style={{...styles.newModal, borderColor: colors.border}}>
            <RowItem title="Beans" text="" onPress={() => navigation.navigate("NewBeans")}>
                <Feather name="chevron-right" size={20} color={colors.interactive}/>
            </RowItem>
            <RowItem title="Brew" text="" onPress={() => navigation.navigate("NewBrew")}>
                <Feather name="chevron-right" size={20} color={colors.interactive}/>
            </RowItem>
        </View>
    );
}

const styles = StyleSheet.create({
    newModal: {
        zIndex: 1,
        borderBottomWidth: 1
    },
});