import React, { useEffect, useState } from 'react';
import {
    Image
} from 'react-native';
import { Asset } from 'expo-asset';

function Icon({uri, size, onRender}) {

    const getUri = (uri) => {
        switch (uri) {
            case "1":
                return Asset.fromModule(require('../../assets/images/Bag_1.png')).uri;
            case "2":
                return Asset.fromModule(require('../../assets/images/Bag_2.png')).uri;
            case "3":
                return Asset.fromModule(require('../../assets/images/Bag_3.png')).uri;
            case "4":
                return Asset.fromModule(require('../../assets/images/Bag_4.png')).uri;
            case "5":
                return Asset.fromModule(require('../../assets/images/Bag_5.png')).uri;
            default:
                return uri;
        }
    }

    return (
        <Image source={{uri: getUri(uri)}} style={{width: size, height: size, resizeMode: 'contain'}} onLoad={onRender?onRender:null}/>
    );
}

export default Icon;