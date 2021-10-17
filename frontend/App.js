import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { createTables, populateBeans, populateBrewMethods, populateBrews, populateFlavors, populateRandomBrews } from './ DatabaseUtils';
import { LightTheme, DarkTheme } from './Themes';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { preferenceReducer } from './src/redux/PreferenceReducer';

import ProfilePage from './src/ProfilePage';
import HomePage from './src/HomePage';
import NewBeans from './src/NewBeans';
import NewBrew from './src/NewBrew';
import BrewMethods from './src/BrewMethods';
import SelectBeans from './src/SelectBeans';
import InfoPage from './src/InfoPage';
import DisplayBeans from './src/DisplayBeans';
import DisplayBrew from './src/DisplayBrew';
import NewBrewMethod from './src/NewBrewMethod';
import EditBrew from './src/EditBrew';
import EditBeans from './src/EditBeans';
import SelectFlavors from './src/SelectFlavors';
import NewFlavor from './src/NewFlavor';

function openDatabase() {
  const db = SQLite.openDatabase("CoffeeLab.db");
  return db;
}

const db = openDatabase();

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
    <NavigationContainer theme={LightTheme}>
        <StatusBar barStyle="dark-content"/>
        <NewStack.Navigator screenOptions={{headerShown: false}}>
          <NewStack.Screen name="HomePage" component={HomePage} />
          <NewStack.Screen name="ProfilePage" component={ProfilePage}/>
          <NewStack.Screen name="BrewMethods" component={BrewMethods}/>
          <NewStack.Screen name="NewBrewMethod" component={NewBrewMethod}/>
          <NewStack.Screen name="NewBeans" component={NewBeans}/>
          <NewStack.Screen name="SelectFlavors" component={SelectFlavors}/>
          <NewStack.Screen name="NewFlavor" component={NewFlavor}/>
          <NewStack.Screen name="DisplayBeans" component={DisplayBeans} />
          <NewStack.Screen name="EditBeans" component={EditBeans}/>
          <NewStack.Screen name="NewBrew" component={NewBrew}/>
          <NewStack.Screen name="SelectBeans" component={SelectBeans}/>
          <NewStack.Screen name="InfoPage" component={InfoPage}/>
          <NewStack.Screen name="DisplayBrew" component={DisplayBrew}/>
          <NewStack.Screen name="EditBrew" component={EditBrew}/>
        </NewStack.Navigator>
    </NavigationContainer>
    </Provider>
  );
};
