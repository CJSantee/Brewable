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

function openDatabase() {
  const db = SQLite.openDatabase("CoffeeLab.db");
  return db;
}

const db = openDatabase();

const Tab = createBottomTabNavigator();
const NewStack = createNativeStackNavigator();
const NewBeansStack = createNativeStackNavigator();
const NewBrewStack = createNativeStackNavigator();

const NewBeansScreen = ({navigation}) => {
  return (
    <NewBeansStack.Navigator>
      <NewBeansStack.Screen name="main" component={NewBeans} options={{ headerShown: false }}/>
    </NewBeansStack.Navigator>
  );
};

const NewBrewScreen = ({navigation}) => {
  return (
    <NewBrewStack.Navigator theme={DarkTheme}>
      <NewBrewStack.Screen name="main" component={NewBrew} options={{ headerShown: false }}/>
      <NewBrewStack.Screen name="brewMethods" component={BrewMethods} options={{ headerShown: false }}/>
      <NewBrewStack.Screen name="addMethod" component={NewBrewMethod} options={{ headerShown: false }}/>
      <NewBrewStack.Screen name="beansOptions" component={SelectBeans} options={{ headerShown: false }}/>
      <NewBrewStack.Screen name="moreInfo" component={InfoPage} options={{ headerShown: false }}/>
    </NewBrewStack.Navigator>
  );
};

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
          <NewStack.Screen name="New Beans" component={NewBeansScreen}/>
          <NewStack.Screen name="New Brew" component={NewBrewScreen}/>
          <NewStack.Screen name="Profile" component={ProfilePage}/>
          <NewBrewStack.Screen name="brewMethods" component={BrewMethods} options={{ headerShown: false }}/>
          <NewBrewStack.Screen name="addMethod" component={NewBrewMethod} options={{ headerShown: false }}/>
        </NewStack.Navigator>
    </NavigationContainer>
    </Provider>
  );
};
