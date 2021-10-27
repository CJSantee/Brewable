import React, { useEffect, useState } from 'react';
import {
    View,
    Image
} from 'react-native';
import { Asset } from 'expo-asset';


function Icon({uri, size}) {
    const [iconURI, setIconURI] = useState("/");

    useEffect(() => {
        switch (uri) {
            case "1":
                setIconURI(Asset.fromModule(require('../../assets/images/Bag_1.png')).uri);
                break;
            case "2":
                setIconURI(Asset.fromModule(require('../../assets/images/Bag_2.png')).uri);
                break;
            case "3":
                setIconURI(Asset.fromModule(require('../../assets/images/Bag_3.png')).uri);
                break;
            case "4":
                setIconURI(Asset.fromModule(require('../../assets/images/Bag_4.png')).uri);
                break
            case "5":
                setIconURI(Asset.fromModule(require('../../assets/images/Bag_5.png')).uri);
                break;
            default:
                setIconURI(uri);
        }
    },[uri]);

    return (
        <Image source={{uri: iconURI}} style={{width: size, height: size, resizeMode: 'contain'}}/>
    );
}

export default Icon;