import React from 'react';
import {
    View
} from 'react-native';
import Svg, {
    Line,
    Polygon,
    Text,
    Defs,
    Mask,
    Rect,
    ClipPath
} from 'react-native-svg';
import { useTheme } from '@react-navigation/native';

// Map individual flavor
function mapFlavor(value) {
    if (value <= 10)
        return 0;
    else if (value >= 90)
        return 5;
    else 
        return Math.floor((value-10)/20)+1;
}

// TODO: Fix mask not covering 3/4 of tasting wheeel

// Maps the values of the flavor wheel from 0-100 to 0-5
function mapFlavors(brew) {
    brew.flavor = mapFlavor(brew.flavor);
    brew.acidity = mapFlavor(brew.acidity);
    brew.aroma = mapFlavor(brew.aroma);
    brew.body = mapFlavor(brew.body);
    brew.sweetness = mapFlavor(brew.sweetness);
    brew.aftertaste = mapFlavor(brew.aftertaste);
    brew.rating = mapFlavor(brew.rating);
    return brew;
}

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

const TastingWheel = ({values, style, displayText, abbreviated, width, height, altValues}) => {
    const descriptors = ["Body", "Aftertaste", "Sweetness", "Aroma", "Flavor", "Acidity"];
    const abbreviations = ["Bdy.", "Aft.", "Swt.", "Aro.", "Fvr.", "Acd."];
    const {colors} = useTheme();

    return (
        <View style={style}> 
            <Svg width={width} height={height} viewBox="-140 -140 280 280">
                <Defs>
                    <Mask
                        id="clip"
                    >
                        {/* <Polygon 
                            points={shape(values)}
                        /> */}
                        <Rect 
                            x="-20"
                            y="-20"
                            width="40"
                            height="40"
                            fill="white"
                        />
                    </Mask>
                </Defs>

                {Array(5).fill().map((_, idx)=>idx).map((value) => (
                    <Polygon
                        key={value} 
                        points={shape([100-(20*value),100-(20*value),100-(20*value),100-(20*value),100-(20*value),100-(20*value)])}
                        stroke={colors.text}
                    />
                ))}

                {Array(6).fill().map((_, idx)=>idx).map((value) => (
                    <Line 
                        key={value}
                        x1="0"
                        y1="0"
                        x2={circleX(0, value*60, 100)}
                        y2={circleY(0, value*60, 100)}
                        stroke={colors.text}
                        strokeWidth="1"
                    />
                ))}
                
                {displayText ? // Body
                <Text
                    fill={colors.text}
                    x={circleX(0, 350, 95)}
                    y={circleY(0, 350, 95)}
                    textAnchor="start"
                    fontSize={abbreviated?22:12}
                >{abbreviated?abbreviations[0]:descriptors[0]}</Text> : <View/> }

                {displayText ? // Aftertaste
                <Text
                    fill={colors.text}
                    x={circleX(3, 55, 100)}
                    y={circleY(0, 55, 105)}
                    textAnchor="start"
                    fontSize={abbreviated?22:12}
                >{abbreviated?abbreviations[1]:descriptors[1]}</Text> : <View/> }

                {displayText ? // Sweetness
                <Text
                    fill={colors.text}
                    x={circleX(0, 120, 115)}
                    y={circleY(0, 120, 100)}
                    textAnchor="end"
                    fontSize={abbreviated?22:12}
                >{abbreviated?abbreviations[2]:descriptors[2]}</Text> : <View/> }

                {displayText ? // Aroma
                <Text
                    fill={colors.text}
                    x={circleX(0, 190, 95)}
                    y={circleY(0, 190, 105)}
                    textAnchor="end"
                    fontSize={abbreviated?22:12}
                >{abbreviated?abbreviations[3]:descriptors[3]}</Text> : <View/> }

                {displayText ? // Flavor
                <Text
                    fill={colors.text}
                    x={circleX(0, 240, 95)}
                    y={circleY(0, 240, 105)}
                    textAnchor="end"
                    fontSize={abbreviated?22:12}
                >{abbreviated?abbreviations[4]:descriptors[4]}</Text> : <View/> }

                {displayText ? // Acidity
                <Text
                    fill={colors.text}
                    x={circleX(3, 300, 95)}
                    y={circleY(0, 300, 105)}
                    textAnchor="start" 
                    fontSize={abbreviated?22:12}
                >{abbreviated?abbreviations[5]:descriptors[5]}</Text> : <View/> }

                <Rect
                    x="-40"
                    y="-40"
                    width="80"
                    height="80"
                    fill="white"
                    mask={"url(#clip)"}
                />

                {/* {altValues&&<Polygon 
                    points={shape(altValues)}
                    fill={"#0d0"}
                    fillOpacity={0.5}
                    stroke={colors.text} 
                    clipPath={"url(#mask)"}
                />}

                <Polygon 
                    points={shape(values)}
                    fill={"#894419"}
                    fillOpacity={0.8}
                    stroke={altValues?"none":colors.text} 
                /> */}

            </Svg>
        </View>

    )
}

export default TastingWheel;