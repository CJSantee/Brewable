import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

import Constants from "expo-constants";
import { useTheme } from "@react-navigation/native";

const Header = ({
    title,
    leftText,
    rightText,
    leftOnPress,
    rightOnPress,
    leftChevron,
    rightChevrom,
    plus,
    plusOnPress,
}) => {
    const { colors } = useTheme();

    return (
        <View
            style={{
                ...styles.header,
                backgroundColor: colors.card,
                borderColor: colors.border,
            }}
        >
            <TouchableOpacity
                style={{ ...styles.left, left: leftChevron ? 10 : 15 }}
                onPress={leftOnPress}
            >
                {leftChevron ? (
                    <Feather
                        name='chevron-left'
                        size={16}
                        color={colors.interactive}
                    />
                ) : (
                    <View />
                )}
                <Text style={{ ...styles.text, color: colors.interactive }}>
                    {leftText}
                </Text>
            </TouchableOpacity>
            <Text style={{ ...styles.title, color: colors.text }}>{title}</Text>
            <View style={{ ...styles.right, right: rightChevrom ? 10 : 15 }}>
                {plus ? (
                    <TouchableOpacity onPress={plusOnPress}>
                        <Feather
                            name='plus'
                            size={14}
                            color={colors.interactive}
                            style={{ marginRight: 15 }}
                        />
                    </TouchableOpacity>
                ) : (
                    <View />
                )}
                <TouchableOpacity onPress={rightOnPress}>
                    <Text style={{ ...styles.text, color: colors.interactive }}>
                        {rightText}
                    </Text>
                    {rightChevrom ? (
                        <Feather
                            name='chevron-right'
                            size={16}
                            color={colors.interactive}
                        />
                    ) : (
                        <View />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        paddingTop: Constants.statusBarHeight,
        height: "12%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 15,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    text: {
        fontSize: 16,
    },
    left: {
        position: "absolute",
        height: "100%",
        marginTop: Constants.statusBarHeight,
        top: 0,
        left: 15,
        marginRight: "auto",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    right: {
        position: "absolute",
        height: "100%",
        marginTop: Constants.statusBarHeight,
        top: 0,
        right: 15,
        marginLeft: "auto",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
});
