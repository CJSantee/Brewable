import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
    Entypo,
    MaterialCommunityIcons,
    FontAwesome,
    FontAwesome5,
} from "@expo/vector-icons";
import { toDateString } from "../utils/Converter";

// Assets
import CoffeeBean from "../../assets/icons/coffeeBean.svg";
import CoffeeGrounds from "../../assets/icons/coffeeGrounds.svg";

// Component Imports
import TastingWheel from "./TastingWheel";

const Brew = ({ brew, colors, navigation, onLongPress, share }) => {
    function profileValues() {
        if (
            brew.body > 0 ||
            brew.aftertaste > 0 ||
            brew.sweetness > 0 ||
            brew.aroma > 0 ||
            brew.flavor > 0 ||
            brew.acidity > 0
        )
            return true;
        return false;
    }

    return (
        <TouchableOpacity
            onPress={() =>
                navigation.navigate("DisplayBrew", { brew_id: brew.id })
            }
            onLongPress={onLongPress}
        >
            <View
                style={{
                    ...styles.brew,
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                }}
            >
                {profileValues() && (
                    <View style={styles.wheel}>
                        <TastingWheel
                            displayText={true}
                            abbreviated={false}
                            width='150'
                            height='150'
                            values={[
                                brew.body,
                                brew.aftertaste,
                                brew.sweetness,
                                brew.aroma,
                                brew.flavor,
                                brew.acidity,
                            ]}
                        />
                        {share && (
                            <Text
                                style={{
                                    top: -10,
                                    fontWeight: "bold",
                                    color: colors.text,
                                }}
                            >
                                {brew.roaster}
                            </Text>
                        )}
                        {share && (
                            <Text style={{ top: -5, color: colors.text }}>
                                {brew.name}
                            </Text>
                        )}
                    </View>
                )}
                <View style={styles.leftItems}>
                    <View style={styles.cardItem}>
                        <Text style={{ ...styles.title, color: colors.text }}>
                            {brew.brew_method}
                        </Text>
                    </View>
                    {brew.water !== 0 && brew.water !== "" && (
                        <View style={styles.cardItem}>
                            <View style={styles.iconContainer}>
                                <Entypo
                                    name='water'
                                    size={22}
                                    color='#0069A7'
                                />
                            </View>
                            <Text
                                style={{ ...styles.value, color: colors.text }}
                            >
                                {brew.water}
                            </Text>
                            <Text style={{ color: colors.text }}>
                                {brew.water_unit}
                            </Text>
                        </View>
                    )}
                    {brew.coffee !== 0 && brew.coffee !== "" && (
                        <View style={styles.cardItem}>
                            <View style={styles.iconContainer}>
                                <CoffeeBean
                                    width={22}
                                    height={22}
                                    style={{ color: "#714B33" }}
                                />
                            </View>
                            <Text
                                style={{ ...styles.value, color: colors.text }}
                            >
                                {brew.coffee}
                            </Text>
                            <Text style={{ color: colors.text }}>
                                {brew.coffee_unit}
                            </Text>
                        </View>
                    )}
                    {brew.grind_setting !== 0 && brew.grind_setting !== "" && (
                        <View style={styles.cardItem}>
                            <View style={styles.iconContainer}>
                                <CoffeeGrounds
                                    width={22}
                                    height={22}
                                    style={{ color: "#714B33" }}
                                />
                            </View>
                            <Text
                                style={{ ...styles.value, color: colors.text }}
                            >
                                {brew.grind_setting}
                            </Text>
                        </View>
                    )}
                    {brew.temperature !== 0 && brew.temperature !== "" && (
                        <View style={styles.cardItem}>
                            <View style={styles.iconContainer}>
                                <FontAwesome5
                                    name='fire'
                                    size={22}
                                    color='#EB811E'
                                />
                            </View>
                            <Text
                                style={{ ...styles.value, color: colors.text }}
                            >
                                {brew.temperature}
                            </Text>
                            <Text style={{ color: colors.text }}>
                                °{brew.temp_unit}
                            </Text>
                        </View>
                    )}
                    {brew.time !== "" && (
                        <View style={styles.cardItem}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons
                                    name='timer'
                                    size={22}
                                    color='#4D814B'
                                />
                            </View>
                            <Text
                                style={{ ...styles.value, color: colors.text }}
                            >
                                {brew.time}
                            </Text>
                        </View>
                    )}
                    <View style={styles.rating}>
                        {Array(brew.rating)
                            .fill()
                            .map((_, idx) => idx)
                            .map((value) => (
                                <FontAwesome
                                    key={value}
                                    name='star'
                                    size={18}
                                    color={"rgb(255,149,67)"}
                                />
                            ))}
                        {Array(5 - brew.rating)
                            .fill()
                            .map((_, idx) => idx)
                            .map((value) => (
                                <FontAwesome
                                    key={value}
                                    name='star-o'
                                    size={18}
                                    color={"rgb(255,149,67)"}
                                />
                            ))}
                    </View>
                </View>
                <View style={styles.favorite}>
                    <FontAwesome
                        icon={brew.favorite ? "heart" : "heart-o"}
                        size={18}
                        color={brew.favorite ? "#a00" : colors.placeholder}
                    />
                </View>
                <Text style={{ ...styles.date, color: colors.text }}>
                    {toDateString(brew.date)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

function arePropsEqual(prevProps, nextProps) {
    const prevBrew = prevProps.brew;
    const nextBrew = nextProps.brew;
    if (prevBrew.brew_method !== nextBrew.brew_method) return false;
    if (
        prevBrew.water !== nextBrew.water ||
        prevBrew.water_unit !== nextBrew.water_unit
    )
        return false;
    if (
        prevBrew.coffee !== nextBrew.coffee ||
        prevBrew.coffee_unit !== nextBrew.coffee_unit
    )
        return false;
    if (
        prevBrew.temperature !== nextBrew.temperature ||
        prevBrew.temp_unit !== nextBrew.temp_unit
    )
        return false;
    if (prevBrew.time !== nextBrew.time) return false;
    if (prevBrew.rating !== nextBrew.rating) return false;
    if (prevBrew.date !== nextBrew.date) return false;
    if (prevBrew.flavor !== nextBrew.flavor) return false;
    if (prevBrew.acidity !== nextBrew.acidity) return false;
    if (prevBrew.aroma !== nextBrew.aroma) return false;
    if (prevBrew.body !== nextBrew.body) return false;
    if (prevBrew.sweetness !== nextBrew.sweetness) return false;
    if (prevBrew.aftertaste !== nextBrew.aftertaste) return false;
    return true;
}

export default memo(Brew, arePropsEqual);

const styles = StyleSheet.create({
    beans: {
        margin: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 18,
    },
    iconContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: 24,
    },
    brew: {
        flex: 1,
        flexDirection: "column",
        marginTop: 10,
        marginHorizontal: 10,
        borderWidth: 0.8,
        height: 250,
        borderRadius: 10,
        paddingHorizontal: 10,
        overflow: "hidden",
    },
    leftItems: {
        height: "100%",
        flexDirection: "column",
        position: "absolute",
        left: 10,
        top: 5,
    },
    wheel: {
        alignSelf: "flex-end",
        alignItems: "center",
    },
    cardItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    value: {
        fontSize: 18,
        marginLeft: 2,
        marginRight: 1,
    },
    date: {
        position: "absolute",
        bottom: 10,
        right: 10,
        fontSize: 16,
    },
    notes: {
        overflow: "hidden",
        width: "55%",
    },
    rating: {
        position: "absolute",
        bottom: 15,
        flexDirection: "row",
    },
    favorite: {
        position: "absolute",
        flexDirection: "row",
        top: 10,
        right: 10,
        zIndex: 1,
    },
});
