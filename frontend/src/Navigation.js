import React from 'react';

import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { LightTheme, DarkTheme } from '../Themes';
import { ThemeProvider } from 'react-native-ios-kit';
import { useSelector } from 'react-redux';
import { useTheme } from '@react-navigation/native';

import CoffeeBean from '../assets/icons/coffeeBean.svg';

// Import Pages
import SettingsPage from './pages/SettingsPage';
import ListBeans from './pages/ListBeans';
import NewBeans from './pages/NewBeans';
import NewBrew from './pages/NewBrew';
import BrewMethods from './pages/BrewMethods';
import SelectIcon from './pages/SelectIcon';
import SelectBeans from './pages/SelectBeans';
import DisplayBeans from './pages/DisplayBeans';
import DisplayBrew from './pages/DisplayBrew';
import EditBrew from './pages/EditBrew';
import EditBeans from './pages/EditBeans';
import SelectFlavors from './pages/SelectFlavors';
// import DeveloperPage from './pages/DeveloperPage';
import AboutPage from './pages/AboutPage';
import SuggestRecipe from './pages/SuggestRecipe';
import ReviewRecipe from './pages/ReviewRecipe';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function StackScreen() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="ListBeans" component={ListBeans} />
            <Stack.Screen name="SettingsPage" component={SettingsPage}/>
            <Stack.Screen name="AboutPage" component={AboutPage}/>
            <Stack.Screen name="BrewMethods" component={BrewMethods}/>
            <Stack.Screen name="NewBeans" component={NewBeans}/>
            <Stack.Screen name="SelectFlavors" component={SelectFlavors}/>
            <Stack.Screen name="SelectIcon" component={SelectIcon}/>
            <Stack.Screen name="DisplayBeans" component={DisplayBeans} />
            <Stack.Screen name="EditBeans" component={EditBeans}/>
            <Stack.Screen name="NewBrew" component={NewBrew}/>
            <Stack.Screen name="SelectBeans" component={SelectBeans}/>
            <Stack.Screen name="DisplayBrew" component={DisplayBrew}/>
            <Stack.Screen name="ReviewRecipe" component={ReviewRecipe}/>
            <Stack.Screen name="SuggestRecipe" component={SuggestRecipe}/>
            <Stack.Screen name="EditBrew" component={EditBrew}/>
        </Stack.Navigator>
    );
}

const Navigation = () => {
    const user_preferences = useSelector(state => state.user_preferences); // User preferences (Redux)
    const colors = useTheme();

    return (
        <ThemeProvider theme={user_preferences.theme === "Light" ? LightTheme.iosKit : DarkTheme.iosKit}>
        <NavigationContainer theme={user_preferences.theme === "Light" ? LightTheme : DarkTheme}>
            <StatusBar barStyle={user_preferences.theme === "Light" ? "dark-content" : "light-content"}/>
            <Tab.Navigator screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    return <CoffeeBean width={20} height={20}/>
                },
                tabBarLabelStyle: {margin: 4},
                headerShown: false,
            })}>
                <Tab.Screen name="Beans" component={StackScreen} />
                {/* <Tab.Screen name="Brews" component={} /> */}
            </Tab.Navigator>
        </NavigationContainer>
        </ThemeProvider>
    );
}

export default Navigation;