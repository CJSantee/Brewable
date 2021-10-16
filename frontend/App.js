import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { createTables, populateBeans, populateBrewMethods, populateBrews } from './ DatabaseUtils';
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
    populateBrews(db);
    populateBrewMethods(db);
  }, []);

  return (
    <Provider store={store}>
    <NavigationContainer theme={LightTheme}>
        <StatusBar barStyle="dark-content"/>
        <NewStack.Navigator screenOptions={{headerShown: false}}>
          <NewStack.Screen name="Home" component={HomePage} />
          <NewStack.Screen name="Beans" component={DisplayBeans} />
          <NewStack.Screen name="Brew" component={DisplayBrew}/>
          <NewStack.Screen name="Edit Brew" component={EditBrew}/>
          <NewStack.Screen name="New Beans" component={NewBeans}/>
          <NewStack.Screen name="New Brew" component={NewBrew}/>
          <NewStack.Screen name="beansOptions" component={SelectBeans}/>
          <NewStack.Screen name="moreInfo" component={InfoPage}/>
          <NewStack.Screen name="Profile" component={ProfilePage}/>
          <NewStack.Screen name="brewMethods" component={BrewMethods}/>
          <NewStack.Screen name="addMethod" component={NewBrewMethod}/>
        </NewStack.Navigator>
    </NavigationContainer>
    </Provider>
  );
};
