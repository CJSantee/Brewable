import React, { useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { useTheme } from '@react-navigation/native';

import Header from '../components/Header';
import BeansCamera from '../components/Camera';
import Icon from '../components/Icon';

const {width, height} = Dimensions.get('window');

const SelectIcon = ({ route, navigation }) => {
    const [selectedIcon, setSelectedIcon] = useState(null); // Selected Icon

    const [cameraVisible, setCameraVisible] = useState(false);
    const [uri, setUri] = useState("");

    const { parent, beans_id } = route.params; // Selected parent navigation page
    const { colors } = useTheme(); // Color theme

    const imageSize = (width/2)-55;

    // Unused?
    const updateBeans = () => {
        db.transaction(
            (tx) => {
                tx.executeSql("UPDATE beans SET photo_uri = ? WHERE id = ?;", [uri, beans_id]);
            },
            (e) => console.log(e),
            () => navigation.navigate(parent, { beans_id: beans_id })
        );
    }

    useEffect(() => {
        if (route.params?.selectedIcon) {
            setSelectedIcon(route.params.selectedIcon);
        }
    }, [route.params?.selectedIcon])

    return (
        <View style={{height: "100%", width: "100%"}}>  
            {!cameraVisible&&<Header 
                title="Icon" 
                leftText="Back"
                leftOnPress={() => navigation.goBack()}
                rightText="Done"
                rightOnPress={() => navigation.navigate(parent, { photo_uri: selectedIcon?selectedIcon:uri })} 
                leftChevron={true}  
            />}
            {cameraVisible?<BeansCamera onCancel={() => setCameraVisible(false)} setUri={setUri}/>
            :<ScrollView>
                <View style={styles.iconsList}>
                    <TouchableOpacity onPress={() => setSelectedIcon("1")} style={{...styles.iconContainer, borderColor: selectedIcon==="1"?colors.interactive:colors.background}}>
                        <Icon uri={"1"} size={imageSize}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedIcon("2")} style={{...styles.iconContainer, borderColor: selectedIcon==="2"?colors.interactive:colors.background}}>
                        <Icon uri={"2"} size={imageSize}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.iconsList}>
                    <TouchableOpacity onPress={() => setSelectedIcon("3")} style={{...styles.iconContainer, borderColor: selectedIcon==="3"?colors.interactive:colors.background}}>
                        <Icon uri={"3"} size={imageSize}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedIcon("4")} style={{...styles.iconContainer, borderColor: selectedIcon==="4"?colors.interactive:colors.background}}>
                        <Icon uri={"4"} size={imageSize}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.iconsList}>
                    <TouchableOpacity onPress={() => setSelectedIcon("5")} style={{...styles.iconContainer, borderColor: selectedIcon==="5"?colors.interactive:colors.background}}>
                        <Icon uri={"5"} size={imageSize}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedIcon("6")} style={{...styles.iconContainer, borderColor: selectedIcon==="6"?colors.interactive:colors.background}}>
                        <Icon uri={"6"} size={imageSize}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.iconsList}>
                    <TouchableOpacity onPress={() => setSelectedIcon("7")} style={{...styles.iconContainer, borderColor: selectedIcon==="7"?colors.interactive:colors.background}}>
                        <Icon uri={"7"} size={imageSize}/>
                    </TouchableOpacity>
                    {uri && !selectedIcon
                    ?<View style={{...styles.iconContainer, borderColor: colors.interactive}}>
                        <Image source={{uri: uri}} style={{
                            width: imageSize, height: imageSize, resizeMode: 'contain'}}/>
                    </View>
                    :<TouchableOpacity style={{marginRight: 15, padding: 15}} onPress={() => {setCameraVisible(true); setSelectedIcon(null)}}>
                        <View style={{width: imageSize, height: imageSize, backgroundColor: colors.border, borderRadius: imageSize/2, alignItems: 'center', justifyContent: 'center'}}>
                            <Image source={require('../../assets/images/CameraBag.png')} style={{
                                width: imageSize*0.7, height: imageSize*0.7, resizeMode: 'contain'}}/>
                        </View>
                    </TouchableOpacity>}
                </View>
            </ScrollView>}
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
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginBottom: 15,
    },
    iconContainer: {
        padding: 15, 
        borderRadius: 30, 
        borderWidth: 2,
    }
});