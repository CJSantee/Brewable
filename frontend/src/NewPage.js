import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    ScrollView,
    Text
} from 'react-native';
import { CustomTheme } from '../Themes';
import Constants from "expo-constants";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { SegmentedControl, Slider } from 'react-native-ios-kit';
import { useTheme } from '@react-navigation/native';

import TableView from './components/TableView';
import RowItem from './components/RowItem';
import TextFieldRow from './components/TextFieldRow';

const NewPage = ({ route, navigation }) => {
    const [brew, setBrew] = useState({brew_method: "...", grind_setting: "", coffee: 0, water: 0, temperature: 0, flavor: 0, acidity: 0, aroma: 0, body: 0, sweetness: 0, aftertaste: 0});
    const {colors} = useTheme();

    useEffect(() => {
        if (route.params?.selected) {
            setBrew({...brew, brew_method: route.params.selected});
        }
    }, [route.params?.selected]);

    return (
        <ScrollView style={styles.container}>
            <TableView header="Method">
                <RowItem
                    text={brew.brew_method}
                    onPress={() => navigation.navigate("brewMethods", {selected: null})}
                >   
                    <FontAwesomeIcon icon={faChevronRight} size={20} color={colors.primary}/>
                </RowItem>
            </TableView>
            <TableView header="Recipe">
                <TextFieldRow 
                    title="Grind Setting"
                    text={brew.grind_setting}
                    onChange={(value) => setBrew({...brew, grind_setting: value})}
                />
                <TextFieldRow
                    title="Coffee Amount"
                    text={brew.coffee}
                    onChange={(value) => setBrew({...brew, coffee: value})}
                    keyboardType="decimal-pad"
                >
                    <SegmentedControl
                        values={['g', 'oz']}
                        selectedIndex={0}
                        onValueChange={() => setBrew({...brew})}
                        style={{width: 100}}
                    />
                </TextFieldRow>
                <TextFieldRow
                    title="Water Amount"
                    text={brew.water}
                    onChange={(value) => setBrew({...brew, water: value})}
                    keyboardType="decimal-pad"
                >
                    <SegmentedControl
                        values={['g', 'oz', 'ml']}
                        selectedIndex={0}
                        onValueChange={() => setBrew({...brew})}
                        style={{width: 100}}
                    />
                </TextFieldRow>
                <TextFieldRow
                    title="Temperature"
                    text={brew.temperature}
                    onChange={(value) => setBrew({...brew, temperature: value})}
                >
                    <SegmentedControl
                        values={['f', 'c']}
                        selectedIndex={0}
                        onValueChange={() => setBrew({...brew})}
                        style={{width: 100}}
                    />
                </TextFieldRow>
            </TableView>
            <TableView header="Flavor">
                <Slider 
                    value={brew.flavor}
                    onValueChange={value => setBrew({...brew, flavor: value})}
                    minValue={0}
                    maxValue={500}
                />
                <Slider 
                    value={brew.acidity}
                    onValueChange={value => setBrew({...brew, acidity: value})}
                    minValue={0}
                    maxValue={500}
                />
                <Slider 
                    value={brew.aroma}
                    onValueChange={value => setBrew({...brew, aroma: value})}
                    minValue={0}
                    maxValue={500}
                />
                <Slider 
                    value={brew.body}
                    onValueChange={value => setBrew({...brew, body: value})}
                    minValue={0}
                    maxValue={500}
                />
                <Slider 
                    value={brew.sweetness}
                    onValueChange={value => setBrew({...brew, sweetness: value})}
                    minValue={0}
                    maxValue={500}
                />
                <Slider 
                    value={brew.aftertaste}
                    onValueChange={value => setBrew({...brew, aftertaste: value})}
                    minValue={0}
                    maxValue={500}
                />
            </TableView>
            <TableView header="More Info">
                <RowItem text="Notes"/>
                <RowItem text="Date"/>
            </TableView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: CustomTheme.colors.background, 
        marginTop: Constants.statusBarHeight
    },
    text: {
        color: CustomTheme.colors.text
    }
})

export default NewPage;