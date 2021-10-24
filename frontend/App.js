import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { createTables, populateBeans, populateBrewMethods, populateFlavors, populateRandomBrews } from './ DatabaseUtils';
import { LightTheme } from './Themes';

import { HoldMenuProvider } from 'react-native-hold-menu';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { preferenceReducer } from './src/redux/PreferenceReducer';

import ProfilePage from './src/pages/ProfilePage';
import HomePage from './src/pages/HomePage';
import NewBeans from './src/pages/NewBeans';
import NewBrew from './src/pages/NewBrew';
import BrewMethods from './src/pages/BrewMethods';
import SelectIcon from './src/pages/SelectIcon';
import SelectBeans from './src/pages/SelectBeans';
import InfoPage from './src/pages/InfoPage';
import DisplayBeans from './src/pages/DisplayBeans';
import DisplayBrew from './src/pages/DisplayBrew';
import EditBrew from './src/pages/EditBrew';
import EditBeans from './src/pages/EditBeans';
import SelectFlavors from './src/pages/SelectFlavors';
import DebugPage from './src/DebugPage';

// Global declaration of SQLite Database
global.db = SQLite.openDatabase("CoffeeLab.db");

const NewStack = createNativeStackNavigator();

const store = createStore(preferenceReducer);

export default function App() {

  useEffect(() => {
    createTables(db);
    populateBeans(db);
    populateRandomBrews(db);
    populateBrewMethods(db);
    populateFlavors(db);
  }, []);

  return (
    <Provider store={store}>
    <HoldMenuProvider iconComponent={FontAwesomeIcon} theme="light">
    <NavigationContainer theme={LightTheme}>
        <StatusBar barStyle="dark-content"/>
        <NewStack.Navigator screenOptions={{headerShown: false}}>
          <NewStack.Screen name="HomePage" component={HomePage} />
          <NewStack.Screen name="ProfilePage" component={ProfilePage}/>
          <NewStack.Screen name="DebugPage" component={DebugPage}/>
          <NewStack.Screen name="BrewMethods" component={BrewMethods}/>
          <NewStack.Screen name="NewBeans" component={NewBeans}/>
          <NewStack.Screen name="SelectFlavors" component={SelectFlavors}/>
          <NewStack.Screen name="SelectIcon" component={SelectIcon}/>
          <NewStack.Screen name="DisplayBeans" component={DisplayBeans} />
          <NewStack.Screen name="EditBeans" component={EditBeans}/>
          <NewStack.Screen name="NewBrew" component={NewBrew}/>
          <NewStack.Screen name="SelectBeans" component={SelectBeans}/>
          <NewStack.Screen name="InfoPage" component={InfoPage}/>
          <NewStack.Screen name="DisplayBrew" component={DisplayBrew}/>
          <NewStack.Screen name="EditBrew" component={EditBrew}/>
        </NewStack.Navigator>
    </NavigationContainer>
    </HoldMenuProvider>
    </Provider>
  );
};
