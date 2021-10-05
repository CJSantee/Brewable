import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Dimensions
} from 'react-native';
import Svg, {
    Circle,
    Line,
    Polygon,
    Text,
    Rect
} from 'react-native-svg';

let {height, width} = Dimensions.get('window');

function dtoi(degrees){
    var pi = Math.PI;
    return degrees * (pi/180);
}

function circleY(originY, degrees, radius) {
    return (Math.sin(dtoi(degrees)) * radius)+originY;
}

function circleX(originX, degrees, radius) {
    return (Math.cos(dtoi(degrees)) * radius)+originX;
}

export function shape(points) {
    let degrees = Array(6).fill().map((_, idx)=>idx*60);
    let ret = "";
    for(let i=0; i<6; i++){
        ret += circleX(0, degrees[i], points[i]).toString();
        ret += ","
        ret += circleY(0, degrees[i], points[i]).toString();
        ret += " ";
    }
    return ret;
}

const TastingWheel = ({values, style, displayText}) => {
    const descriptors = ["Body", "Aftertaste", "Sweetness", "Aroma", "Flavor", "Acidity"];
    const colors = ["#fff", "#fff", "#fff"]

    return (
        <View style={style}> 
            <Svg width="250" height="250" rotation="50" viewBox="-140 -140 280 280">
                {/* <Rect 
                    x="-150"
                    y="-150"
                    width="300"
                    height="300"
                    fill="blue"
                /> */}

                {Array(5).fill().map((_, idx)=>idx).map((value) => (
                    <Polygon
                        key={value} 
                        points={shape([100-(20*value),100-(20*value),100-(20*value),100-(20*value),100-(20*value),100-(20*value)])}
                        stroke="black"
                        fill={colors[value%3]}
                    />
                ))}

                {Array(6).fill().map((_, idx)=>idx).map((value) => (
                    <Line 
                        key={value}
                        x1="0"
                        y1="0"
                        x2={circleX(0, value*60, 100)}
                        y2={circleY(0, value*60, 100)}
                        stroke="#000"
                        strokeWidth="1"
                    />
                ))}

                {displayText ?
                <Text
                    fill="#000"
                    x={circleX(0, 350, 95)}
                    y={circleY(0, 350, 95)}
                    textAnchor="start"
                >{descriptors[0]}</Text> : <View/> }
                {displayText ?
                <Text
                    fill="#000"
                    x={circleX(0, 55, 100)}
                    y={circleY(0, 55, 105)}
                    textAnchor="start"
                >{descriptors[1]}</Text> : <View/> }
                {displayText ?
                <Text
                    fill="#000"
                    x={circleX(0, 120, 115)}
                    y={circleY(0, 120, 100)}
                    textAnchor="end"
                >{descriptors[2]}</Text> : <View/> }
                {displayText ?
                <Text
                    fill="#000"
                    x={circleX(0, 190, 95)}
                    y={circleY(0, 190, 105)}
                    textAnchor="end"
                >{descriptors[3]}</Text> : <View/> }
                {displayText ?
                <Text
                    fill="#000"
                    x={circleX(0, 240, 95)}
                    y={circleY(0, 240, 105)}
                    textAnchor="end"
                >{descriptors[4]}</Text> : <View/> }
                {displayText ?
                <Text
                    fill="#000"
                    x={circleX(0, 300, 95)}
                    y={circleY(0, 300, 105)}
                    textAnchor="start" 
                >{descriptors[5]}</Text> : <View/> }
                
                <Polygon 
                    points={shape(values)}
                    fill="#742900"
                    fillOpacity="0.5"
                    stroke="#964B00"
                />
            </Svg>
        </View>

    )
}

export default TastingWheel;

const styles = StyleSheet.create({
    container: {
        height: height,
        width: width,
        alignItems: 'center',
        justifyContent: 'center'
    }
});