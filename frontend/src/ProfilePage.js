import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from 'react-native';
import Constants from "expo-constants";
import { SegmentedControl } from 'react-native-ios-kit';
import { useTheme } from '@react-navigation/native';

import Header from './components/Header';
import TableView from './components/TableView';
import RowItem from './components/RowItem';
import TextFieldRow from './components/TextFieldRow';

const ProfilePage = ({ navigation }) => {
    const {colors} = useTheme();

    return (
        <View style={{width: "100%", height: "100%"}}>
            <Header title="Profile" leftText="Back" leftChevron={true} leftOnPress={() => navigation.goBack()}/>
            <ScrollView style={styles.container}>
                <TableView header="Unit Defaults">
                    <RowItem title="Coffee" text="">
                        <SegmentedControl
                            values={['g', 'oz']}
                            selectedIndex={0}
                            onValueChange={(value) => console.log(value)}
                            style={{width: 100}}
                            theme={{primaryColor: colors.interactive}}
                        />
                    </RowItem>
                    <RowItem title="Water" text="">
                        <SegmentedControl
                            values={['g', 'oz', 'ml']}
                            selectedIndex={0}
                            onValueChange={(value) => console.log(value)}
                            style={{width: 100}}
                            theme={{primaryColor: colors.interactive}}
                        />
                    </RowItem>
                    <RowItem title="Temperature" text="">
                        <SegmentedControl
                            values={['f', 'c']}
                            selectedIndex={0}
                            onValueChange={(value) => console.log(value)}
                            style={{width: 100}}
                            theme={{primaryColor: colors.interactive}}
                        />
                    </RowItem>
                </TableView>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
    }
})

export default ProfilePage;