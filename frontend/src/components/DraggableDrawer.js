import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View, Dimensions } from 'react-native';

import {
    PanGestureHandler,
    State,
    RectButton
} from 'react-native-gesture-handler';

import { USE_NATIVE_DRIVER } from '../../config';

let {height, width} = Dimensions.get('window');

const RATIO = 1;

class DraggableDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = { drawerColor: "#aaa", };
        this._height = 0;
        this._dragY = new Animated.Value(0);
        this._transY = this._dragY.interpolate({
            inputRange: [0, RATIO],
            outputRange: [0, 1],
        });
        this._showDrawer = this._dragY.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [0, 0, 1],
        });
        this._actionListener = (event) => {
            const endOffsetY =
            event.nativeEvent.translationY + 0.05 * event.nativeEvent.velocityY;
        }
        this._onGestureEvent = Animated.event(
            [{ nativeEvent: { translationY: this._dragY } }],
            { listener: this._actionListener, useNativeDriver: USE_NATIVE_DRIVER }
        );
    }

    _onHandlerStateChange = event => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            const dragToss = 0.05;
            const endOffsetY =
            event.nativeEvent.translationY + dragToss * event.nativeEvent.velocityY;

            let toValue = 0;
            if (endOffsetY < 0) {
                toValue = -(height-100);
            } else if (endOffsetY > 0) {
                toValue = 0;
            } 

            Animated.spring(this._dragY, {
                velocity: event.nativeEvent.velocityY,
                tension: 15,
                friction: 5,
                toValue,
                useNativeDriver: USE_NATIVE_DRIVER,
            }).start();
            this.setState({drawerColor: "#aaa"});
        }
    };
    _onLayout = event => {
        this._height = event.nativeEvent.layout.height;
    };
    _reset = () => {
        Animated.spring(this._dragY, {
        toValue: 0,
        useNativeDriver: USE_NATIVE_DRIVER,
        tension: 15,
        friction: 5,
        }).start();
    };

    render() {
        const { children, colors } = this.props;
        return (
            <PanGestureHandler
                {...this.props}
                activeOffsetY={[-10, 10]}
                onGestureEvent={this._onGestureEvent}
                onHandlerStateChange={this._onHandlerStateChange}>
                <Animated.View
                    style={[
                        styles.drawer,
                        {
                            backgroundColor: colors.background,
                            transform: [{ translateY: this._transY }],
                        }
                    ]}
                    onLayout={this._onLayout}>
                        <Text style={{alignSelf: 'center',fontSize: 14, marginVertical: 10}}>{this.props.title}</Text>
                        {children}
                </Animated.View>
            </PanGestureHandler>
        );
    }
}

export default DraggableDrawer;

const styles = StyleSheet.create({
    drawer: {
        flex: 1,
        position: 'absolute',
        top: height-60,
        width: width,
        height: height-40,
        borderTopStartRadius: 15,
        borderTopEndRadius: 15,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
    }
});