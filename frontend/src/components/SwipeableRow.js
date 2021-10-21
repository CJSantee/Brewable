import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import {
    PanGestureHandler,
    State,
    RectButton
} from 'react-native-gesture-handler';

import { USE_NATIVE_DRIVER } from '../../config';

const RATIO = 2;

class SwipeableRow extends Component {
    constructor(props) {
        super(props);
        this.state = { leftColor: "#c9d2d9", rightColor: "#c9d2d9", };
        this._width = 0;
        this._dragX = new Animated.Value(0);
        this._transX = this._dragX.interpolate({
            inputRange: [0, RATIO],
            outputRange: [0, 1],
        });
        this._showLeftAction = this._dragX.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [0, 0, 1],
        });
        this._actionListener = (event) => {
            const endOffsetX =
            event.nativeEvent.translationX + 0.05 * event.nativeEvent.velocityX;
            if (endOffsetX > this._width / 2) 
                this.setState({leftColor: "#4CAF50"});
            else if (endOffsetX < -this._width / 2) 
                this.setState({rightColor: "#F44336"});
        }
        this._showRightAction = this._dragX.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [1, 0, 0],
        });
        this._onGestureEvent = Animated.event(
            [{ nativeEvent: { translationX: this._dragX } }],
            { listener: this._actionListener, useNativeDriver: USE_NATIVE_DRIVER }
        );
    }

    _onHandlerStateChange = event => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            const dragToss = 0.05;
            const endOffsetX =
            event.nativeEvent.translationX + dragToss * event.nativeEvent.velocityX;

            let toValue = 0;
            if (endOffsetX > this._width / 2) {
                this.props.onSwipeLeft();
            } else if (endOffsetX < -this._width / 2) {
                this.props.onSwipeRight();
            }

            Animated.spring(this._dragX, {
                velocity: event.nativeEvent.velocityX,
                tension: 15,
                friction: 5,
                toValue,
                useNativeDriver: USE_NATIVE_DRIVER,
            }).start();
            this.setState({leftColor: "#c9d2d9", rightColor: "#c9d2d9"});
        }
    };
    _onLayout = event => {
        this._width = event.nativeEvent.layout.width;
    };
    _reset = () => {
        Animated.spring(this._dragX, {
        toValue: 0,
        useNativeDriver: USE_NATIVE_DRIVER,
        tension: 15,
        friction: 5,
        }).start();
    };

    render() {
        const { children } = this.props;
        return (
        <View>
            <Animated.View
                style={[styles.rowAction, { opacity: this._showLeftAction }]}>
                <RectButton
                    style={{...styles.rowAction, backgroundColor: this.state.leftColor}}
                    onPress={this._reset}>
                    <Text style={styles.actionButtonText}>Green</Text>
                </RectButton>
            </Animated.View>
            <Animated.View
                style={[styles.rowAction, { opacity: this._showRightAction }]}>
                <RectButton
                    style={[styles.rowAction, {backgroundColor: this.state.rightColor}]}
                    onPress={this._reset}>
                    <Text style={styles.actionButtonText}>Red</Text>
                </RectButton>
            </Animated.View>
            <PanGestureHandler
                {...this.props}
                activeOffsetX={[-10, 10]}
                onGestureEvent={this._onGestureEvent}
                onHandlerStateChange={this._onHandlerStateChange}>
                <Animated.View
                    style={{
                    backgroundColor: 'white',
                    transform: [{ translateX: this._transX }],
                    }}
                    onLayout={this._onLayout}>
                    {children}
                </Animated.View>
            </PanGestureHandler>
        </View>
        );
    }
}

export default SwipeableRow;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rectButton: {
        flex: 1,
        height: 60,
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    rowAction: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftAction: {
        backgroundColor: '#4CAF50',
    },
    rightAction: {
        backgroundColor: '#F44336',
    },
    actionButtonText: {
        color: 'white',
        fontSize: 16,
    },
});