import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    Alert
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const {width, height} = Dimensions.get('window');

// Component Imports
import { SegmentedControl } from 'react-native-ios-kit';
import TableView from '../components/TableView';
import TextFieldRow from '../components/TextFieldRow';
import DatePickerRow from '../components/DatePickerRow';
import RowItem from '../components/RowItem';
import Header from '../components/Header';
import Icon from '../components/Icon';

function mapRating(value) {
    if (value <= 10)
        return 0;
    else if (value >= 90)
        return 5;
    else 
        return Math.floor((value-10)/20)+1;
}

const NewBeans = ({ route, navigation }) => {
    const [beans, setBeans] = useState({
        name: "", 
        roaster: "", 
        origin: "", 
        roast_level: "", 
        roast_date: new Date(), 
        price: 0, 
        weight: 0, weight_unit: 'g', 
        flavor_notes: "", 
        rating: 0, 
        photo_uri: null,
        favorite: 0
    }); // Beans state

    const { colors } = useTheme(); // Color theme
    const user_preferences = useSelector(state => state.user_preferences); // User preferences (Redux)

    const missingInfoAlert = () => {
        Alert.alert(
            "Missing Fields",
            "Please enter a Roaster and add an icon.",
            [
                {text: "OK"}
            ]
        )
    }

    // Add beans to database
    const addBeans = () => {
        if (!beans.roaster || !beans.photo_uri) {
            missingInfoAlert();
            return false;
        }
    
        db.transaction(
            (tx) => {
                tx.executeSql(`
                    INSERT INTO beans
                    (name, roaster, origin, roast_level, roast_date, price, weight, weight_unit, flavor_notes, rating, photo_uri, favorite)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                    [beans.name, beans.roaster, beans.origin, beans.roast_level, beans.roast_date.toJSON(), beans.price, beans.weight, beans.weight_unit, beans.flavor_notes, mapRating(beans.rating), beans.photo_uri, beans.favorite]);
            },
            (e) => {console.log(e)},
            () => navigation.goBack()
        );
    }

    useEffect(() => {
        // If child page provides flavor_notes, update beans.flavor_notes
        if (route.params?.flavor_notes) {
            setBeans({ ...beans, flavor_notes: route.params.flavor_notes});
        } else {
            setBeans({ ...beans, flavor_notes: "" })
        }

        // If child page provides photo_uri, update beans.photo_uri
        if (route.params?.photo_uri) {
            setBeans({...beans, photo_uri: route.params.photo_uri});
        }

    }, [route.params?.flavor_notes, route.params?.photo_uri]);

    return (
        <View style={{flex: 1}}>
            <Header 
                title="New Beans" 
                leftText="Cancel" rightText="Done" 
                leftOnPress={() => navigation.goBack()} 
                rightOnPress={() => addBeans()}
            />
            <KeyboardAwareScrollView>
                <View style={styles.photoContainer}>
                    {beans.photo_uri  
                    ?<TouchableOpacity onPress={() => navigation.navigate("SelectIcon", { parent: "NewBeans", selectedIcon: beans.photo_uri })}>
                        <View style={{marginTop: 10, flexDirection: 'column', alignItems: 'center'}}>
                            <Icon uri={beans.photo_uri} size={(width/2)-55}/>
                            <Text style={{color: colors.interactive, fontSize: 15, margin: 5}}>Edit Icon</Text>
                        </View>
                    </TouchableOpacity>
                    :<TouchableOpacity onPress={() => navigation.navigate("SelectIcon", { parent: "NewBeans" })}>
                        <View style={{marginTop: 10, flexDirection: 'column', alignItems: 'center'}}>
                            <View style={{...styles.openCameraButton, backgroundColor: colors.border}}>
                                <Image source={require('../../assets/images/Bag_Icon.png')} style={styles.image}/>
                            </View>
                            <Text style={{color: colors.interactive, fontSize: 15, margin: 5}}>Add Icon</Text>
                        </View>
                    </TouchableOpacity>}
                </View>

                <TableView header="Roast">
                    <TextFieldRow 
                        title="Roaster"
                        text={beans.roaster}
                        onChange={(value) => setBeans({...beans, roaster: value})}    
                    />
                    <TextFieldRow 
                        title="Name"
                        text={beans.name}
                        onChange={(value) => setBeans({...beans, name: value})}    
                    />
                    <TextFieldRow 
                        title="Origin"
                        text={beans.origin}
                        onChange={(value) => setBeans({...beans, origin: value})}    
                    />
                    <TextFieldRow 
                        title="Roast Level"
                        text={beans.roast_level}
                        onChange={(value) => setBeans({...beans, roast_level: value})}    
                    />
                </TableView>
                <TableView header="Bag">
                    <DatePickerRow title="Roast Date" value={beans.roast_date} onChange={(value) => {setBeans({...beans, roast_date: value});}}/>
                    <TextFieldRow 
                        title="Weight"
                        text={beans.weight}
                        onChange={(value) => setBeans({...beans, weight: value})}
                        keyboardType="decimal-pad"
                    >
                        <SegmentedControl
                            values={['g', 'oz']}
                            selectedIndex={['g', 'oz'].indexOf(user_preferences.coffee_unit)}
                            onValueChange={(value) => setBeans({...beans, weight_unit: value})}
                            style={{width: 100}}
                            theme={{primaryColor: colors.interactive}}
                        />
                    </TextFieldRow>
                </TableView>
                <TableView header="Flavor">
                    <RowItem
                        title="Flavor Notes"
                        text=""
                        onPress={() => navigation.navigate("SelectFlavors", { parent: "NewBeans", flavor_notes: beans.flavor_notes })}
                    >   
                        <Feather name="chevron-right" size={16} color={colors.placeholder}/>
                    </RowItem>
                    <View style={styles.flavors}>
                        {beans.flavor_notes !== "" ? beans.flavor_notes.split(',').map((item) => 
                            <View key={item} style={{...styles.flavor, backgroundColor: colors.card, borderColor: colors.border}}>
                                <Text style={styles.flavorText}>{item}</Text>
                            </View>
                        ) : <View/>}
                    </View>
                </TableView>
                <TableView>
                    <TouchableOpacity onPress={() => setBeans({...beans, favorite: beans.favorite===0?1:0})} style={{flex: 1}}>
                        <View style={{...styles.bottomButton, backgroundColor: colors.card, borderColor: colors.border}}>
                            <Text style={{color: colors.interactive, fontSize: 16, marginRight: 5}}>{beans.favorite===0?"Favorite":"Unfavorite"}</Text>
                            <FontAwesome name={beans.favorite===1?"heart":"heart-o"} color={colors.interactive}/>
                        </View>
                    </TouchableOpacity>
                </TableView>
            </KeyboardAwareScrollView>
        </View>        
    );
}

export default NewBeans;

const styles = StyleSheet.create({
    photoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10
    },
    image: {
        alignSelf: 'center',
        width: 75, 
        height: 75, 
        resizeMode: 'contain'
    },  
    icon: {
        width: (width/2)-55,
        height: (width/2)-55,
        resizeMode: 'contain'
    },
    openCameraButton: {
        borderRadius: 60,
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center'
    },
    flavors: {
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'wrap'
    },  
    flavor: {
        display: 'flex',
        marginHorizontal: 10,
        marginBottom: 15,
        borderWidth: 1,
        padding: 10,
        borderRadius: 15
    },
    flavorText: {
        fontSize: 16
    },
    bottomButton: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 15,
        borderWidth: 1,
        padding: 10,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor:'rgba(0,0,0,0.3)', 
        alignItems: 'center',
        justifyContent: 'center'
    },
    flavorModal: {
        width: width-30,
        margin: 15,
        borderWidth: 1,
        borderRadius: 15,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginHorizontal: 15,
        borderBottomWidth: 1,
        paddingBottom: 5,
    }, 
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    closeModalIcon: {
        position: 'absolute',
        right: 0,
        top: 2,
    },
    modalText: {
        marginVertical: 10,
        marginHorizontal: 15,
        fontSize: 16
    }
});