import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Asset } from 'expo-asset';
import AppLoading from 'expo-app-loading';
import * as ScreenOrientation from 'expo-screen-orientation';

import { createTables, populateBeans, populateBrewMethodsIfEmpty, populateFlavorsIfEmpty, populateRandomBrews } from './ DatabaseUtils';
import { LightTheme } from './Themes';

import { HoldMenuProvider } from 'react-native-hold-menu';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { preferenceReducer } from './src/redux/PreferenceReducer';

import SettingsPage from './src/pages/SettingsPage';
import HomePage from './src/pages/HomePage';
import NewBeans from './src/pages/NewBeans';
import NewBrew from './src/pages/NewBrew';
import BrewMethods from './src/pages/BrewMethods';
import SelectIcon from './src/pages/SelectIcon';
import SelectBeans from './src/pages/SelectBeans';
import DisplayBeans from './src/pages/DisplayBeans';
import DisplayBrew from './src/pages/DisplayBrew';
import EditBrew from './src/pages/EditBrew';
import EditBeans from './src/pages/EditBeans';
import SelectFlavors from './src/pages/SelectFlavors';

// Global declaration of SQLite Database
global.db = SQLite.openDatabase("CoffeeLab.db");

const NewStack = createNativeStackNavigator();

const store = createStore(preferenceReducer);

export default function App() {
  const [isReady, setIsReady] = useState(false);

  const  _cacheResourcesAsync = async () => {
    const images = [
      require('./assets/images/Bag_1.png'),
      require('./assets/images/Bag_2.png'),
      require('./assets/images/Bag_3.png'),
      require('./assets/images/Bag_4.png'),
      require('./assets/images/Bag_5.png'),
      require('./assets/images/Bag_Icon.png'),
      require('./assets/images/BeansBag.png'),
      require('./assets/images/CameraBag.png'),
    ]

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    }); 

    return Promise.all(cacheImages);
  }

  const _lockScreenOrientation = async ()  => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }

  useEffect(() => {
    _lockScreenOrientation();
    createTables(db);
    // populateBeans(db);
    // populateRandomBrews(db);
    populateBrewMethodsIfEmpty(db);
    populateFlavorsIfEmpty(db);
  }, []);

  return (
    isReady === false ? 
    (<AppLoading
      startAsync={_cacheResourcesAsync}
      onFinish={() => setIsReady(true)}
      onError={console.warn}
    />):
    (<Provider store={store}>
    <HoldMenuProvider iconComponent={FontAwesomeIcon} theme="light">
    <NavigationContainer theme={LightTheme}>
        <StatusBar barStyle="dark-content"/>
        <NewStack.Navigator screenOptions={{headerShown: false}}>
          <NewStack.Screen name="HomePage" component={HomePage} />
          <NewStack.Screen name="SettingsPage" component={SettingsPage}/>
          <NewStack.Screen name="BrewMethods" component={BrewMethods}/>
          <NewStack.Screen name="NewBeans" component={NewBeans}/>
          <NewStack.Screen name="SelectFlavors" component={SelectFlavors}/>
          <NewStack.Screen name="SelectIcon" component={SelectIcon}/>
          <NewStack.Screen name="DisplayBeans" component={DisplayBeans} />
          <NewStack.Screen name="EditBeans" component={EditBeans}/>
          <NewStack.Screen name="NewBrew" component={NewBrew}/>
          <NewStack.Screen name="SelectBeans" component={SelectBeans}/>
          <NewStack.Screen name="DisplayBrew" component={DisplayBrew}/>
          <NewStack.Screen name="EditBrew" component={EditBrew}/>
        </NewStack.Navigator>
    </NavigationContainer>
    </HoldMenuProvider>
    </Provider>)
  );
};
