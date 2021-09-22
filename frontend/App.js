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
import NewPage from './src/NewPage';
import BrewMethods from './src/BrewMethods';

function openDatabase() {
  const db = SQLite.openDatabase("CoffeeLab.db");
  return db;
}

const db = openDatabase();

const Tab = createBottomTabNavigator();
const NewStack = createNativeStackNavigator();

const NewStackScreen = () => {
  return (
    <NewStack.Navigator >
      <NewStack.Screen name="main" component={NewPage} options={{
        headerTitle: "New Brew",
        headerRight: () => (
          <Button onPress={() => alert("Added")} title="Add"/>
        )
      }}/>
      <NewStack.Screen name="brewMethods" component={BrewMethods} options={{
        headerTitle: "Brew Methods"
      }}/>
    </NewStack.Navigator>
  );
};

export default function App() {

  useEffect(() => {
    createTables(db);
  }, []);

  return (
    <NavigationContainer theme={CustomTheme}>
        <StatusBar barStyle="dark-content"/>
        <Tab.Navigator screenOptions={({ route }) => ({
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
        </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
});
