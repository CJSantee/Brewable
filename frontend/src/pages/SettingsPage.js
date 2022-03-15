import React, { useCallback, useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import * as Notifications from "expo-notifications";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useSelector, useDispatch } from "react-redux";
import {
    updateWaterUnit,
    updateCoffeeUnit,
    updateTempUnit,
    updateRatio,
    updateGrinder,
    updateTheme,
    updateAutofillRatio,
    updateNotificationTime,
    updateNotificationsActive,
} from "../redux/actions";
import * as WebBrowser from "expo-web-browser";

// Component Imports
import { SegmentedControl, Switch } from "react-native-ios-kit";
import Header from "../components/Header";
import TableView from "../components/TableView";
import RowItem from "../components/RowItem";
import TextFieldRow from "../components/TextFieldRow";
import DateTimePicker from "@react-native-community/datetimepicker";

const SettingsPage = ({ navigation }) => {
    const { colors } = useTheme(); // Color theme
    const [ratio, setRatio] = useState("");
    const [grinder, setGrinder] = useState("");
    const dispatch = useDispatch(); // Redux dispatch
    const user_preferences = useSelector((state) => state.user_preferences); // User preferences (Redux)

    const openPrivacyPolicy = () => {
        WebBrowser.openBrowserAsync("http://brewableapp.com/#/privacy");
    };

    function parseRatio(value) {
        let str = value.substring(4, value.length);
        return str;
    }
    function submitRatio() {
        let val = parseFloat(ratio);
        if (isNaN(val) || val <= 0) val = 1.0;
        dispatch(updateRatio(val));
    }
    function submitGrinder() {
        dispatch(updateGrinder(grinder));
    }

    async function scheduleNotification(date) {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Time to Brew!",
                },
                trigger: {
                    hour: date.getHours(),
                    minute: date.getMinutes(),
                    repeats: true,
                },
            });
        } catch (e) {
            console.log(e);
        }
    }

    async function cancelAllScheduledNotifications() {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
        } catch (e) {
            console.log(e);
        }
    }

    function updateScheduledNotifications(date) {
        cancelAllScheduledNotifications().then(scheduleNotification(date));
    }

    function dateOnChange(event, date) {
        if (user_preferences.notifications_active)
            updateScheduledNotifications(date);

        dispatch(updateNotificationTime(date));
    }

    function toggleNotifications(value) {
        if (value) {
            registerForPushNotifications().then(
                scheduleNotification(
                    new Date(user_preferences.notification_time)
                )
            );
        } else {
            cancelAllScheduledNotifications();
        }
        dispatch(updateNotificationsActive(value));
    }

    useFocusEffect(
        useCallback(() => {
            setRatio(user_preferences.ratio);
            setGrinder(user_preferences.grinder);
        }, [])
    );

    return (
        <View style={{ width: "100%", height: "100%" }}>
            <Header
                title='Settings'
                leftText='Back'
                leftChevron={true}
                leftOnPress={() => navigation.goBack()}
            />
            <ScrollView style={styles.container}>
                <TableView header='Unit Preferences'>
                    <RowItem title='Coffee' text=''>
                        <SegmentedControl
                            values={["g", "oz"]}
                            selectedIndex={["g", "oz"].indexOf(
                                user_preferences.coffee_unit
                            )}
                            onValueChange={(value) =>
                                dispatch(updateCoffeeUnit(value))
                            }
                            style={{ width: 100 }}
                        />
                    </RowItem>
                    <RowItem title='Water' text=''>
                        <SegmentedControl
                            values={["g", "oz", "ml"]}
                            selectedIndex={["g", "oz", "ml"].indexOf(
                                user_preferences.water_unit
                            )}
                            onValueChange={(value) =>
                                dispatch(updateWaterUnit(value))
                            }
                            style={{ width: 100 }}
                        />
                    </RowItem>
                    <RowItem title='Temperature' text=''>
                        <SegmentedControl
                            values={["f", "c"]}
                            selectedIndex={["f", "c"].indexOf(
                                user_preferences.temp_unit
                            )}
                            onValueChange={(value) =>
                                dispatch(updateTempUnit(value))
                            }
                            style={{ width: 100 }}
                        />
                    </RowItem>
                </TableView>
                <TableView header='My Data'>
                    <RowItem
                        title='Brew Methods'
                        text=''
                        onPress={() =>
                            navigation.navigate("BrewMethods", {
                                parent: "SettingsPage",
                            })
                        }
                    >
                        <Feather
                            name='chevron-right'
                            size={16}
                            color={colors.placeholder}
                        />
                    </RowItem>
                    <RowItem
                        title='Flavor Notes'
                        text=''
                        onPress={() =>
                            navigation.navigate("SelectFlavors", {
                                parent: "SettingsPage",
                                flavor_notes: "",
                            })
                        }
                    >
                        <Feather
                            name='chevron-right'
                            size={16}
                            color={colors.placeholder}
                        />
                    </RowItem>
                    <TextFieldRow
                        title='My Grinder'
                        text={grinder}
                        onChange={(value) => setGrinder(value)}
                        onEndEditing={submitGrinder}
                    />
                </TableView>
                <TableView header='Autofill Ratio'>
                    <TextFieldRow
                        text={"1 : " + ratio}
                        title=''
                        titleOnly
                        keyboardType='numeric'
                        activeTextColor={
                            user_preferences.autofill_ratio
                                ? colors.text
                                : colors.placeholder
                        }
                        onChange={(value) => setRatio(parseRatio(value))}
                        onEndEditing={submitRatio}
                    >
                        <Switch
                            value={user_preferences.autofill_ratio}
                            onValueChange={(value) =>
                                dispatch(updateAutofillRatio(value))
                            }
                        />
                    </TextFieldRow>
                </TableView>
                <TableView header='Brew Reminder'>
                    <RowItem title='' text=''>
                        <View style={{ flex: 1 }}>
                            <DateTimePicker
                                mode='time'
                                value={
                                    user_preferences.notification_time
                                        ? new Date(
                                              user_preferences.notification_time
                                          )
                                        : new Date()
                                }
                                display='default'
                                onChange={dateOnChange}
                                style={{ width: 320 }}
                                themeVariant={user_preferences.theme.toLowerCase()}
                            />
                        </View>
                        <Switch
                            value={user_preferences.notifications_active}
                            onValueChange={(value) =>
                                toggleNotifications(value)
                            }
                        />
                    </RowItem>
                </TableView>
                <TableView header='App'>
                    <RowItem title='Theme' text=''>
                        <SegmentedControl
                            values={["Light", "Dark"]}
                            selectedIndex={["Light", "Dark"].indexOf(
                                user_preferences.theme
                            )}
                            onValueChange={(value) =>
                                dispatch(updateTheme(value))
                            }
                            style={{ width: 150 }}
                        />
                    </RowItem>
                </TableView>
                <TableView header='info'>
                    <RowItem
                        title='About'
                        text=''
                        onPress={() => navigation.navigate("AboutPage")}
                    >
                        <Feather
                            name='chevron-right'
                            size={16}
                            color={colors.placeholder}
                        />
                    </RowItem>
                    <RowItem
                        title='Privacy Policy'
                        text=''
                        onPress={openPrivacyPolicy}
                    >
                        <Feather
                            name='chevron-right'
                            size={16}
                            color={colors.placeholder}
                        />
                    </RowItem>
                    <RowItem title='Version' text=''>
                        <Text style={{ color: colors.text }}>1.1.0</Text>
                    </RowItem>
                </TableView>
            </ScrollView>
        </View>
    );
};

async function registerForPushNotifications() {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
        alert("Must use physical device for Push Notifications");
    }
    return token;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 25,
    },
});

export default SettingsPage;
