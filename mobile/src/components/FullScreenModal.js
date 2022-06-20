import React, { Component } from "react";
import { Animated, StyleSheet, Text, View, Dimensions } from "react-native";

import { PanGestureHandler, State } from "react-native-gesture-handler";

import { USE_NATIVE_DRIVER } from "../../config";

let { height, width } = Dimensions.get("window");

const RATIO = 1;
const tabHeight = height / 2;
const topOffset = 100;

class FullScreenModal extends Component {
    constructor(props) {
        super(props);

        this._lastScrollYValue = 0;
        this._lastScrollY = new Animated.Value(0);
        this._onRegisterLastScroll = Animated.event(
            [{ nativeEvent: { contentOffset: { y: this._lastScrollY } } }],
            { useNativeDriver: USE_NATIVE_DRIVER }
        );
        this._lastScrollY.addListener(({ value }) => {
            this._lastScrollYValue = value;
        });

        this._dragY = new Animated.Value(0);

        this._reverseLastScrollY = Animated.multiply(
            new Animated.Value(-1),
            this._lastScrollY
        );

        this._translateYOffset = new Animated.Value(1);
        this._transY = Animated.add(
            this._translateYOffset,
            Animated.add(this._dragY, this._reverseLastScrollY)
        ).interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        });
        this._onGestureEvent = Animated.event(
            [{ nativeEvent: { translationY: this._dragY } }],
            {
                listener: this._actionListener,
                useNativeDriver: USE_NATIVE_DRIVER,
            }
        );
    }

    componentDidMount() {
        Animated.spring(this._translateYOffset, {
            velocity: 0.5,
            tension: 10,
            friction: 5,
            toValue: -tabHeight,
            useNativeDriver: USE_NATIVE_DRIVER,
        }).start();
    }

    _onHandlerStateChange = (event) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            let { translationY } = event.nativeEvent;
            let close = false;
            translationY -= this._lastScrollYValue;
            const dragToss = 0.05;
            const endOffsetY =
                event.nativeEvent.translationY +
                dragToss * event.nativeEvent.velocityY;

            let toValue = 0;
            if (endOffsetY < 0) {
                toValue = -(height - topOffset);
            } else if (endOffsetY > 0) {
                toValue = 0;
                close = true;
            }

            this._translateYOffset.extractOffset();
            this._translateYOffset.setValue(translationY);
            this._translateYOffset.flattenOffset();
            this._dragY.setValue(0);

            Animated.spring(this._translateYOffset, {
                velocity: event.nativeEvent.velocityY,
                tension: 15,
                friction: 5,
                toValue,
                useNativeDriver: USE_NATIVE_DRIVER,
            }).start(() => {
                if (close) this.props.close();
            });
        }
    };

    render() {
        const { children, colors } = this.props;
        return (
            <PanGestureHandler
                {...this.props}
                activeOffsetY={[-10, 10]}
                onGestureEvent={this._onGestureEvent}
                onHandlerStateChange={this._onHandlerStateChange}
            >
                <Animated.View
                    style={[
                        styles.animated,
                        {
                            transform: [{ translateY: this._transY }],
                        },
                    ]}
                    onLayout={this._onLayout}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            width: width,
                        }}
                    >
                        <View
                            style={{
                                ...styles.bar,
                                backgroundColor: colors.placeholder,
                            }}
                        />
                    </View>
                    <View
                        style={{
                            ...styles.menu,
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                        }}
                    >
                        {children}
                    </View>
                </Animated.View>
            </PanGestureHandler>
        );
    }
}

export default FullScreenModal;

const styles = StyleSheet.create({
    animated: {
        flex: 1,
        position: "absolute",
        top: height,
        width: width,
    },
    menu: {
        height: height - (topOffset - tabHeight),
        borderTopStartRadius: 5,
        borderTopEndRadius: 5,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
    bar: {
        width: 50,
        height: 6,
        borderRadius: 4,
        margin: 5,
    },
});
