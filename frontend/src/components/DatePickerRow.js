import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";

// IDEA: react-native-date-picker
import DateTimePicker from "@react-native-community/datetimepicker";

const DatePickerRow = ({ title, value, onChange }) => {
    const { colors } = useTheme(); // Color theme
    const user_preferences = useSelector((state) => state.user_preferences); // User preferences (Redux)

    const setDate = (event, selectedDate) => {
        const currentDate = selectedDate || value;
        onChange(currentDate);
    };

    return (
        <View
            style={{
                ...styles.row,
                backgroundColor: colors.card,
                borderTopWidth: StyleSheet.hairlineWidth,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderColor: colors.border,
                justifyContent: title ? "space-between" : "center",
            }}
        >
            <Text style={{ ...styles.text, color: colors.placeholder }}>
                {title}
            </Text>
            <DateTimePicker
                mode='date'
                display='default'
                value={new Date(value)}
                onChange={setDate}
                style={styles.datePicker}
                themeVariant={user_preferences.theme.toLowerCase()}
            />
        </View>
    );
};

export default DatePickerRow;

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 15,
        paddingRight: 14,
        paddingVertical: 4,
        minHeight: 43,
    },
    datePicker: {
        width: 125,
    },
    text: {
        fontSize: 17,
    },
});
