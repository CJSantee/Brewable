import React from 'react';

import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LightTheme, DarkTheme } from '../Themes';
import { ThemeProvider } from 'react-native-ios-kit';
import { useSelector } from 'react-redux';

// Import Pages
import SettingsPage from './pages/SettingsPage';
import HomePage from './pages/HomePage';
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
import DeveloperPage from './pages/DeveloperPage';
import AboutPage from './pages/AboutPage';
import SuggestRecipe from './pages/SuggestRecipe';
import ReviewRecipe from './pages/ReviewRecipe';

const NavStack = createNativeStackNavigator();

const Navigation = () => {
    const user_preferences = useSelector(state => state.user_preferences); // User preferences (Redux)

    return (
        <ThemeProvider theme={user_preferences.theme === "Light" ? LightTheme.iosKit : DarkTheme.iosKit}>
        <NavigationContainer theme={user_preferences.theme === "Light" ? LightTheme : DarkTheme}>
            <StatusBar barStyle={user_preferences.theme === "Light" ? "dark-content" : "light-content"}/>
            <NavStack.Navigator screenOptions={{headerShown: false}}>
                <NavStack.Screen name="HomePage" component={HomePage} />
                <NavStack.Screen name="SettingsPage" component={SettingsPage}/>
                <NavStack.Screen name="DeveloperPage" component={DeveloperPage}/>
                <NavStack.Screen name="AboutPage" component={AboutPage}/>
                <NavStack.Screen name="BrewMethods" component={BrewMethods}/>
                <NavStack.Screen name="NewBeans" component={NewBeans}/>
                <NavStack.Screen name="SelectFlavors" component={SelectFlavors}/>
                <NavStack.Screen name="SelectIcon" component={SelectIcon}/>
                <NavStack.Screen name="DisplayBeans" component={DisplayBeans} />
                <NavStack.Screen name="EditBeans" component={EditBeans}/>
                <NavStack.Screen name="NewBrew" component={NewBrew}/>
                <NavStack.Screen name="SelectBeans" component={SelectBeans}/>
                <NavStack.Screen name="DisplayBrew" component={DisplayBrew}/>
                <NavStack.Screen name="ReviewRecipe" component={ReviewRecipe}/>
                <NavStack.Screen name="SuggestRecipe" component={SuggestRecipe}/>
                <NavStack.Screen name="EditBrew" component={EditBrew}/>
            </NavStack.Navigator>
        </NavigationContainer>
        </ThemeProvider>
    );
}

export default Navigation;