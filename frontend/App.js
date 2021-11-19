import React, { useEffect, useState, useRef } from 'react';
import * as SQLite from 'expo-sqlite';

import { Asset } from 'expo-asset';
import AppLoading from 'expo-app-loading';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Notifications from 'expo-notifications';
import Constants from "expo-constants";
import { createTables, checkForUpdate, populateBrewMethodsIfEmpty, populateFlavorsIfEmpty } from './src/utils/DatabaseUtils';

import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

import { store, persistor } from './src/redux/store';

import Navigation from './src/Navigation';

// Global declaration of SQLite Database
global.db = SQLite.openDatabase("CoffeeLab.db");

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const  _cacheResourcesAsync = async () => {
    const images = [
      require('./assets/images/Bag_1.png'),
      require('./assets/images/Bag_2.png'),
      require('./assets/images/Bag_3.png'),
      require('./assets/images/Bag_4.png'),
      require('./assets/images/Bag_5.png'),
      require('./assets/images/Bag_6.png'),
      require('./assets/images/Bag_7.png'),
      require('./assets/images/Bag_Icon.png'),
      require('./assets/images/BeansBag.png'),
      require('./assets/images/CameraBag.png'),
    ]

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    }); 

    return Promise.all(cacheImages);
  }

  useEffect(() => {
    lockScreenOrientation();
    registerForPushNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener();
    responseListener.current = Notifications.addNotificationResponseReceivedListener();

    createTables(db);
    checkForUpdate(db);
    populateBrewMethodsIfEmpty(db);
    populateFlavorsIfEmpty(db);

    return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        
        {isReady === false ? 
        <AppLoading
          startAsync={_cacheResourcesAsync}
          onFinish={() => setIsReady(true)}
          onError={console.warn}
        />:<Navigation />}  

      </PersistGate>
    </Provider>
  );
};

async function lockScreenOrientation() {
  await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
}

async function registerForPushNotifications() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }
  return token;
}