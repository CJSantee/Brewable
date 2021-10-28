import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

const {width, height} = Dimensions.get('window');

function BeansCamera({ onCancel, setUri }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    const camera = useRef(null);

    const _takePhoto = async () => {
        if (camera) {
            const photo = await camera.current.takePictureAsync();
            _handleSave(photo.uri);
            onCancel();
        }
    }

    const _handleSave = async(photo) => {
        const {status} = await MediaLibrary.requestPermissionsAsync();
        if(status === "granted"){
            const asset = await MediaLibrary.createAssetAsync(photo);
            const album = await MediaLibrary.getAlbumAsync('Coffee Lab');
            if (album !== null) {
                let assets = [];
                assets.push(asset);
                MediaLibrary.addAssetsToAlbumAsync(assets, album.id);
            } else {
                MediaLibrary.createAlbumAsync('Coffee Lab', asset);
            }
            setUri(asset.uri);
        } else {
            console.log("Missing permissions");
        }
    }

    useEffect(() => {
        (async () => {
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={styles.container}>
        <Camera style={styles.camera} type={type} ref={camera}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onCancel}>
                    <Text style={styles.text}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pictureButtonOutline} onPress={_takePhoto}>
                    <View style={styles.pictureButton}/>
                </TouchableOpacity>
            </View>
            {/* <View style={styles.beansOutline}/> */}
        </Camera>
        </View>
    );
}

export default BeansCamera;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end'
    },
    buttonContainer: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15
    },
    cancelButton: {
        position: 'absolute',
        alignSelf: 'flex-start',
        alignItems: 'center',
        margin: 15
    },
    flipButton: {
        position: 'absolute',
        alignSelf: 'flex-end',
        alignItems: 'center',
        margin: 15
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    cameraCancelButton: {
        position: 'absolute',
        left: 50,
    },
    pictureButtonOutline: {
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
        borderRadius: 50,
        borderWidth: 5,
        borderColor: 'white',
        width: 75,
        height: 75,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
    },
    pictureButton: {
        backgroundColor: 'white',
        width: 55,
        height: 55,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0)',
    },
    beansOutline:{
        position: 'absolute',
        top: width/3,
        alignSelf: 'center',
        borderWidth: 3,
        width: width/2,
        height: height/2,
    }
});
