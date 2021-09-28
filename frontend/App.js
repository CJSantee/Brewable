import React, { useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { StyleSheet, Text, View, StatusBar, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlusCircle, faHome, faHeart, faSearch, faMale } from '@fortawesome/free-solid-svg-icons';

import { createTables } from './ DatabaseUtils';
import { CustomTheme } from './Themes';
import ProfilePage from './src/ProfilePage';
import HomePage from './src/HomePage';
import NewBeans from './src/NewBeans';
import NewBrew from './src/NewBrew';
import BrewMethods from './src/BrewMethods';
import SelectBeans from './src/SelectBeans';

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
    <NewBrewStack.Navigator >
      
      <NewBrewStack.Screen name="main" component={NewBrew} options={{ headerShown: false }}/>
      <NewBrewStack.Screen name="brewMethods" component={BrewMethods} options={{ headerTitle: "Brew Methods" }}/>
      <NewBrewStack.Screen name="beansOptions" component={SelectBeans} options={{ headerTitle: "Select Beans" }}/>
    </NewBrewStack.Navigator>
  );
};

export default function App() {

  useEffect(() => {
    createTables(db);
  }, []);

  return (
    <NavigationContainer theme={CustomTheme}>
        <StatusBar barStyle="dark-content"/>
        <NewStack.Navigator screenOptions={{headerShown: false}}>
          <NewStack.Screen name="Home" component={HomePage} />
          <NewStack.Screen name="New Beans" component={NewBeansScreen}/>
          <NewStack.Screen name="New Brew" component={NewBrewScreen}/>
        </NewStack.Navigator>
        {/* <Tab.Navigator screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let icon;
            if (route.name === "Home") icon = faHome;
            else if (route.name === "Favorites") icon = faHeart;
            else if (route.name === "New") icon = faPlusCircle;
            else if (route.name === "Search") icon = faSearch;
            else icon = faMale;
            return <FontAwesomeIcon icon={icon} size={size} color={color}/>;
          },
          headerShown: false,
          tabBarStyle: { height: 60 },
          tabBarLabelStyle: { marginBottom: 5 }
        })}>
          <Tab.Screen name="Home" component={ ProfilePage }/>
          <Tab.Screen name="Favorites" component={ ProfilePage }/>
          <Tab.Screen name="New" component={ NewStackScreen }/>
          <Tab.Screen name="Search" component={ ProfilePage }/>
          <Tab.Screen name="Profile" component={ ProfilePage }/>
        </Tab.Navigator> */}
    </NavigationContainer>
  );
};
