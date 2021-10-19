import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';

const {width, height} = Dimensions.get('window');

function BeansCamera({ onCancel, setUri }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    const camera = useRef(null);

    const _takePhoto = async () => {
        if (camera) {
            const photo = await camera.current.takePictureAsync();
            setUri(photo.uri);
            onCancel();
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
                    <Text style={styles.text}> Cancel </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pictureButtonOutline} onPress={_takePhoto}>
                    <View style={styles.pictureButton}>

                    </View>
                </TouchableOpacity>
                {/* <TouchableOpacity
                    style={styles.flipButton}
                    onPress={() => {
                    setType(
                        type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                    );
                    }}>
                    <Text style={styles.text}> Flip </Text>
                </TouchableOpacity> */}
            </View>
            <View style={styles.beansOutline}>

            </View>
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
