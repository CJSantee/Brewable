import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useAssets } from 'expo-asset';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import TableView from '../components/TableView';
import Header from '../components/Header';

const {width, height} = Dimensions.get('window');

const SelectIcon = ({ route, navigation }) => {
    const { parent } = route.params; // Selected parent navigation page
    const { colors } = useTheme(); // Color theme
    const [assets] = useAssets([
        require('../../assets/BeansBag.png'),
        require('../../assets/BeansIcons/Bag_1.png'),
        require('../../assets/BeansIcons/Bag_2.png'),
        require('../../assets/BeansIcons/Bag_3.png'),
        require('../../assets/BeansIcons/Bag_4.png'),
        require('../../assets/BeansIcons/Bag_5.png')
    ]);
    // State Variables
    const [selectedIcon, setSelectedIcon] = useState(null); // Selected Icon
    const imageSize = (width/2)-55;

    return (
        <View style={{height: "100%", width: "100%"}}>  
            <Header 
                title="Icon" 
                leftText="Back"
                leftOnPress={() => navigation.goBack()} 
                leftChevron={true}  
            />
            <View style={{marginVertical: 15}}>
                <View style={styles.iconsList}>
                    <TouchableOpacity onPress={() => setSelectedIcon("Bag_1.png")} style={{marginLeft: 15, padding: 15, borderRadius: 30, borderWidth: 2, borderColor: selectedIcon==="Bag_1.png"?colors.interactive:colors.background}}>
                        <Image source={require('../../assets/BeansIcons/Bag_1.png')} style={{
                            width: imageSize, height: imageSize, resizeMode: 'contain'}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedIcon("Bag_2.png")} style={{marginRight: 15, padding: 15, borderRadius: 30, borderWidth: 2, borderColor: selectedIcon==="Bag_2.png"?colors.interactive:colors.background}}>
                        <Image source={require('../../assets/BeansIcons/Bag_2.png')} style={{
                            width: imageSize, height: imageSize, resizeMode: 'contain'}}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.iconsList}>
                    <TouchableOpacity onPress={() => setSelectedIcon("Bag_3.png")} style={{marginLeft: 15, padding: 15, borderRadius: 30, borderWidth: 2, borderColor: selectedIcon==="Bag_3.png"?colors.interactive:colors.background}}>
                        <Image source={require('../../assets/BeansIcons/Bag_3.png')} style={{
                            width: imageSize, height: imageSize, resizeMode: 'contain'}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedIcon("Bag_4.png")} style={{marginRight: 15, padding: 15, borderRadius: 30, borderWidth: 2, borderColor: selectedIcon==="Bag_4.png"?colors.interactive:colors.background}}>
                        <Image source={require('../../assets/BeansIcons/Bag_4.png')} style={{
                            width: imageSize, height: imageSize, resizeMode: 'contain'}}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.iconsList}>
                    <TouchableOpacity onPress={() => setSelectedIcon("Bag_5.png")} style={{marginLeft: 15, padding: 15, borderRadius: 30, borderWidth: 2, borderColor: selectedIcon==="Bag_5.png"?colors.interactive:colors.background}}>
                        <Image source={require('../../assets/BeansIcons/Bag_5.png')} style={{
                            width: imageSize, height: imageSize, resizeMode: 'contain'}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedIcon("Bag_4.png")} style={{marginRight: 15, padding: 15, borderRadius: 30, borderWidth: 2, borderColor: selectedIcon==="Bag_6.png"?colors.interactive:colors.background}}>
                        <Image source={require('../../assets/BeansIcons/Bag_4.png')} style={{
                            width: imageSize, height: imageSize, resizeMode: 'contain'}}/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default SelectIcon;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
    },
    iconsList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    }
});