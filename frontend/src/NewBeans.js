import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { faChevronRight, faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';

// Component Imports
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { SegmentedControl } from 'react-native-ios-kit';
import { Camera } from 'expo-camera';
import TableView from './components/TableView';
import TextFieldRow from './components/TextFieldRow';
import DatePickerRow from './components/DatePickerRow';
import RowItem from './components/RowItem';
import Header from './components/Header';
import SliderRow from './components/SliderRow';
import BeansCamera from './components/Camera';

function mapRating(value) {
    if (value <= 10)
        return 0;
    else if (value >= 90)
        return 5;
    else 
        return Math.floor((value-10)/20)+1;
}

const NewBeans = ({ route, navigation }) => {
    const [beans, setBeans] = useState({region: "", roaster: "", origin: "", roast_level: "", roast_date: new Date(), price: 0, weight: 0, weight_unit: "g", flavor_notes: "", rating: 0}); // Beans state

    // Camera state variables
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [camera, setCamera] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const [imageTaken, setImageTaken] = useState(false);
    const [cameraVisible, setCameraVisible] = useState(false);

    const {colors} = useTheme(); // Color theme
    const user_preferences = useSelector(state => state.user_preferences); // User preferences (Redux)

    // Take picture
    const takePicture = async() => {
        console.log("CLICK");
        if (camera) {
            const data = await camera.takePictureAsync(null);
            setCameraVisible(false);
            setImageTaken(true);
        }
    }
    
    const launchCamera = () =>{
        if (hasPermission === null) {
          return <View />;
        }
        if (hasPermission === false) {
          return <Text>No access to camera</Text>;
        }
        
        setCameraVisible(true);  
    }

    // Add beans to database
    const addBeans = () => {
        if (beans === null ||  beans.region === "") {
            console.log("Missing Name");
            return false;
        }
    
        db.transaction(
            (tx) => {
                tx.executeSql(`
                    INSERT INTO beans
                    (region, roaster, origin, roast_level, roast_date, price, weight, weight_unit, flavor_notes, rating)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                    [beans.region, beans.roaster, beans.origin, beans.roast_level, beans.roast_date.toJSON(), beans.price, beans.weight, beans.weight_unit, beans.flavor_notes, mapRating(beans.rating)]);
            },
            (e) => {console.log(e)},
            () => navigation.goBack()
        );
    }

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    useEffect(() => {
        if (route.params?.flavor_notes) { // If parent provides flavor_notes, update beans.flavor_notes
            setBeans({ ...beans, flavor_notes: route.params.flavor_notes});
        } else {
            setBeans({ ...beans, flavor_notes: "" })
        }
    }, [route.params?.flavor_notes]);

    return (
        <View style={{width: "100%", height: "100%"}}>
            {!cameraVisible&&<Header 
                title="New Beans" 
                leftText="Cancel" rightText="Done" 
                leftOnPress={() => navigation.goBack()} 
                rightOnPress={() => addBeans()}
            />}
            {cameraVisible 
            ? <BeansCamera onCancel={() => setCameraVisible(false)} setUri={setImageUri}/>
            :<ScrollView>
                <View style={styles.cameraIcon}>
                    <TouchableOpacity style={styles.openCameraButton} onPress={() => launchCamera()}>
                        {imageUri ? <Image style={{width: 60, height: 60, resizeMode: 'contain'}} source={{uri: imageUri}}/> : <FontAwesomeIcon icon={faCamera} size={35} style={{margin: 25}}/>}
                    </TouchableOpacity>
                </View>

                <TableView header="Roast">
                    <TextFieldRow 
                        title="Roaster"
                        text={beans.roaster}
                        onChange={(value) => setBeans({...beans, roaster: value})}    
                    />
                    <TextFieldRow 
                        title="Region"
                        text={beans.region}
                        onChange={(value) => setBeans({...beans, region: value})}    
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
                        title="Price"
                        text={beans.price}
                        onChange={(value) => setBeans({...beans, price: value})}
                        keyboardType="decimal-pad"
                    />
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
                        <FontAwesomeIcon icon={faChevronRight} size={16} color={colors.placeholder}/>
                    </RowItem>
                    <View style={styles.flavors}>
                        {beans.flavor_notes !== "" ? beans.flavor_notes.split(',').map((item) => 
                            <View key={item} style={styles.flavor}>
                                <Text style={styles.flavorText}>{item}</Text>
                            </View>
                        ) : <View/>}
                    </View>
                </TableView>
                <TableView header="Review">
                    <SliderRow 
                        title="Rating"
                        value={beans.rating}
                        onValueChange={value => setBeans({...beans, rating: value})}
                        onPress={() => navigation.navigate("InfoPage",{topic: "Rating"})}
                    />
                </TableView>
            </ScrollView>}
        </View>   
        
    );
}

export default NewBeans;

const styles = StyleSheet.create({
    cameraIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10
    },
    openCameraButton: {
        borderWidth: 1,
        borderRadius: 50
    },
    flavors: {
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
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
    }
});