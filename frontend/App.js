import React, { useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { StyleSheet, Text, View, StatusBar, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlusCircle, faHome, faHeart, faSearch, faMale } from '@fortawesome/free-solid-svg-icons';

import { createTables, populateBeans, populateBrews } from './ DatabaseUtils';
import { LightTheme, DarkTheme } from './Themes';
import ProfilePage from './src/ProfilePage';
import HomePage from './src/HomePage';
import NewBeans from './src/NewBeans';
import NewBrew from './src/NewBrew';
import BrewMethods from './src/BrewMethods';
import SelectBeans from './src/SelectBeans';
import InfoPage from './src/InfoPage';
import DisplayBeans from './src/DisplayBeans';
import DisplayBrew from './src/DisplayBrew';

function openDatabase() {
  const db = SQLite.openDatabase("CoffeeLab.db");
  return db;
}

const db = openDatabase();

const Tab = createBottomTabNavigator();
const NewStack = createNativeStackNavigator();
const NewBeansStack = createNativeStackNavigator();
const NewBrewStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

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
      <NewBrewStack.Screen name="beansOptions" component={SelectBeans} options={{ headerShown: false }}/>
      <NewBrewStack.Screen name="moreInfo" component={InfoPage} options={{ headerShown: false }}/>
    </NewBrewStack.Navigator>
  );
};

const SettingsScreen = ({navigation}) => {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="main" component={ProfilePage} options={{ headerShown: false }}/>
    </SettingsStack.Navigator>
  );
}

export default function App() {

  useEffect(() => {
    createTables(db);
    populateBeans(db);
    populateBrews(db);
  }, []);

  return (
    <NavigationContainer theme={LightTheme}>
        <StatusBar barStyle="dark-content"/>
        <NewStack.Navigator screenOptions={{headerShown: false}}>
          <NewStack.Screen name="Home" component={HomePage} />
          <NewStack.Screen name="Beans" component={DisplayBeans} />
          <NewStack.Screen name="Brew" component={DisplayBrew}/>
          <NewStack.Screen name="New Beans" component={NewBeansScreen}/>
          <NewStack.Screen name="New Brew" component={NewBrewScreen}/>
          <NewStack.Screen name="Profile" component={SettingsScreen}/>
        </NewStack.Navigator>
    </NavigationContainer>
  );
};
