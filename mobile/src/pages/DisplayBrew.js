import React, { useCallback, useState } from "react";
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import { useTheme, useFocusEffect } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

// Component Imports
import TastingWheel from "../components/TastingWheel";
import Header from "../components/Header";
import RecipeRow from "../components/RecipeRow";
import { toDateString } from "../utils/Converter";

let { height, width } = Dimensions.get("window");

const DisplayBrew = ({ route, navigation }) => {
    const [brew, setBrew] = useState({
        id: 0,
        body: 0,
        aftertaste: 0,
        sweetness: 0,
        aroma: 0,
        flavor: 0,
        acidity: 0,
        favorite: 0,
        rating: 0,
    }); // Initial values for flavor wheel
    const { brew_id } = route.params; // Brew_id to retireve brew info
    const { colors } = useTheme(); // Color theme

    const onFavorite = () => {
        let val = brew.favorite;
        // Update brew in database
        db.transaction(
            (tx) => {
                tx.executeSql("UPDATE brews SET favorite = ? WHERE id = ?;", [
                    val === 0 ? 1 : 0,
                    brew.id,
                ]);
            },
            (e) => console.log(e),
            null
        );
        // Update brew state within component
        setBrew({ ...brew, favorite: val === 0 ? 1 : 0 });
    };

    // Load brew by brew.id when component renders
    useFocusEffect(
        useCallback(() => {
            let mounted = true;
            db.transaction(
                (tx) => {
                    tx.executeSql(
                        `SELECT brews.*, beans.roaster, beans.name 
                        FROM brews 
                        LEFT JOIN beans ON brews.beans_id = beans.id
                        WHERE brews.id = ?;`,
                        [brew_id],
                        (_, { rows: { _array } }) => {
                            if (mounted) setBrew(_array[0]);
                        }
                    );
                },
                (e) => console.log(e),
                null
            );
            return () => (mounted = false);
        }, [])
    );

    const SuggestRecipeButton = () => {
        return (
            <View style={{ width: "100%", padding: 10, marginBottom: 5 }}>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("ReviewRecipe", { brew: brew })
                    }
                >
                    <View
                        style={{
                            ...styles.suggestRecipeButton,
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                margin: 10,
                                color: colors.text,
                            }}
                        >
                            Suggest New Recipe
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View
            style={{ ...styles.container, backgroundColor: colors.background }}
        >
            <Header
                title='Brew'
                leftText='Back'
                rightText='Edit'
                leftOnPress={() => navigation.goBack()}
                rightOnPress={() =>
                    navigation.navigate("EditBrew", {
                        parent: "DisplayBrew",
                        brew_id: brew.id,
                    })
                }
            />
            <ScrollView>
                <View style={styles.row}>
                    <View
                        style={{
                            flexDirection: "row",
                            width: width - 45,
                            flexWrap: "wrap",
                        }}
                    >
                        <Text style={{ ...styles.title, color: colors.text }}>
                            {brew.roaster}{" "}
                        </Text>
                        <Text
                            style={{ ...styles.subtitle, color: colors.text }}
                        >
                            {brew.name}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.favorite}
                        onPress={() => onFavorite()}
                    >
                        <FontAwesome
                            name={brew.favorite ? "heart" : "heart-o"}
                            size={25}
                            color={brew.favorite ? "#a00" : colors.placeholder}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <Text style={{ fontSize: 18, color: colors.text }}>
                        {toDateString(brew.date)} -{" "}
                    </Text>
                    <Text style={{ fontSize: 18, color: colors.text }}>
                        {brew.brew_method}
                    </Text>
                </View>
                <RecipeRow brew={brew} />
                <View style={styles.notes}>
                    <Text style={{ fontSize: 15, color: colors.text }}>
                        {brew.notes}
                    </Text>
                </View>
                <View style={styles.rating}>
                    {Array(brew.rating)
                        .fill()
                        .map((_, idx) => idx)
                        .map((value) => (
                            <FontAwesome
                                key={value}
                                name='star'
                                size={30}
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
                                size={30}
                                color={"rgb(255,149,67)"}
                            />
                        ))}
                </View>
                <TastingWheel
                    style={styles.wheel}
                    displayText={true}
                    width={width}
                    height={width}
                    values={[
                        brew.body,
                        brew.aftertaste,
                        brew.sweetness,
                        brew.aroma,
                        brew.flavor,
                        brew.acidity,
                    ]}
                />
                <SuggestRecipeButton />
            </ScrollView>
        </View>
    );
};

export default DisplayBrew;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flexDirection: "row",
        marginHorizontal: 10,
        marginVertical: 5,
        alignItems: "center",
        flexWrap: "wrap",
    },
    favorite: {
        position: "absolute",
        right: 0,
    },
    title: {
        fontWeight: "bold",
        fontSize: 22,
    },
    subtitle: {
        fontSize: 22,
    },
    notes: {
        marginHorizontal: 10,
    },
    wheel: {
        width: "100%",
    },
    rating: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginVertical: 15,
    },
    suggestRecipeButton: {
        width: "100%",
        alignSelf: "center",
        borderWidth: 1,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },
});
