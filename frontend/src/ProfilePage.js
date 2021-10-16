import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from 'react-native';
import { SegmentedControl } from 'react-native-ios-kit';
import { Stepper } from 'react-native-ios-kit';
import { useTheme } from '@react-navigation/native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight, faStopwatch } from '@fortawesome/free-solid-svg-icons';

import { useSelector, useDispatch } from 'react-redux'
import { updateWaterUnit, updateCoffeeUnit, updateTempUnit, updateRatio } from './redux/PreferenceActions';

import Header from './components/Header';
import TableView from './components/TableView';
import RowItem from './components/RowItem';

const ProfilePage = ({ navigation }) => {
    const {colors} = useTheme();
    const dispatch = useDispatch();
    const user_preferences = useSelector(state => state.user_preferences);

    return (
        <View style={{width: "100%", height: "100%"}}>
            <Header title="Profile" leftText="Back" leftChevron={true} leftOnPress={() => navigation.goBack()}/>
            <ScrollView style={styles.container}>
                <TableView header="Unit Defaults">
                    <RowItem title="Coffee" text="">
                        <SegmentedControl
                            values={['g', 'oz']}
                            selectedIndex={['g','oz'].indexOf(user_preferences.coffee_unit)}
                            onValueChange={(value) => dispatch(updateCoffeeUnit(value))}
                            style={{width: 100}}
                            theme={{primaryColor: colors.interactive}}
                        />
                    </RowItem>
                    <RowItem title="Water" text="">
                        <SegmentedControl
                            values={['g', 'oz', 'ml']}
                            selectedIndex={['g', 'oz', 'ml'].indexOf(user_preferences.water_unit)}
                            onValueChange={(value) => dispatch(updateWaterUnit(value))}
                            style={{width: 100}}
                            theme={{primaryColor: colors.interactive}}
                        />
                    </RowItem>
                    <RowItem title="Temperature" text="">
                        <SegmentedControl
                            values={['f', 'c']}
                            selectedIndex={['f', 'c'].indexOf(user_preferences.temp_unit)}
                            onValueChange={(value) => dispatch(updateTempUnit(value))}
                            style={{width: 100}}
                            theme={{primaryColor: colors.interactive}}
                        />
                    </RowItem>
                </TableView>
                <TableView header="Methods">
                    <RowItem
                        title="Brew Methods"
                        text=""
                        onPress={() => navigation.navigate("brewMethods", {method: "none"})}
                    >   
                        <FontAwesomeIcon icon={faChevronRight} size={16} color={colors.placeholder}/>
                    </RowItem>
                </TableView>
                <TableView header="Ratio">
                    <RowItem 
                        title={"1 : "+user_preferences.ratio} text=""
                    >
                        <Stepper
                            value={user_preferences.ratio}
                            onValueChange={(value) => dispatch(updateRatio(value))}
                            minValue={1}
                            maxValue={100}
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