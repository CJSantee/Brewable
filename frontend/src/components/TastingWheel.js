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

function dtor(degrees){
    var pi = Math.PI;
    return degrees * (pi/180);
}

function circleY(originY, degrees, radius) {
    return (Math.sin(dtor(degrees)) * radius)+originY;
}

function circleX(originX, degrees, radius) {
    return (Math.cos(dtor(degrees)) * radius)+originX;
}

export function shape(points) {
    let degrees = Array(6).fill().map((_, idx)=>idx*60);
    let ret = "";
    for(let i=0; i<6; i++){
        ret += circleX(140, degrees[i], points[i]).toString();
        ret += ","
        ret += circleY(140, degrees[i], points[i]).toString();
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
            <Svg width={width} height={height} viewBox="0 0 280 280">
                <Defs>
                    <Mask
                        id="mask"
                    >
                        <Rect 
                            x="0"
                            y="0"
                            width="280"
                            height="280"
                            fill="white"
                        />
                        <Polygon 
                            points={shape(values)}
                            fill="black"
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

                {Array(6).fill().map((_, idx)=>idx).map((value) => ( // Lines
                    <Line 
                        key={value}
                        x1="140"
                        y1="140"
                        x2={circleX(140, value*60, 100)}
                        y2={circleY(140, value*60, 100)}
                        stroke={colors.text}
                        strokeWidth="1"
                    />
                ))}
                
                {displayText ? // Body
                <Text
                    fill={colors.text}
                    x={circleX(140, 350, 95)}
                    y={circleY(140, 350, 95)}
                    textAnchor="start"
                    fontSize={abbreviated?22:12}
                >{abbreviated?abbreviations[0]:descriptors[0]}</Text> : <View/> }

                {displayText ? // Aftertaste
                <Text
                    fill={colors.text}
                    x={circleX(143, 55, 100)}
                    y={circleY(140, 55, 105)}
                    textAnchor="start"
                    fontSize={abbreviated?22:12}
                >{abbreviated?abbreviations[1]:descriptors[1]}</Text> : <View/> }

                {displayText ? // Sweetness
                <Text
                    fill={colors.text}
                    x={circleX(140, 120, 115)}
                    y={circleY(140, 120, 100)}
                    textAnchor="end"
                    fontSize={abbreviated?22:12}
                >{abbreviated?abbreviations[2]:descriptors[2]}</Text> : <View/> }

                {displayText ? // Aroma
                <Text
                    fill={colors.text}
                    x={circleX(140, 190, 95)}
                    y={circleY(140, 190, 105)}
                    textAnchor="end"
                    fontSize={abbreviated?22:12}
                >{abbreviated?abbreviations[3]:descriptors[3]}</Text> : <View/> }

                {displayText ? // Flavor
                <Text
                    fill={colors.text}
                    x={circleX(140, 240, 95)}
                    y={circleY(140, 240, 105)}
                    textAnchor="end"
                    fontSize={abbreviated?22:12}
                >{abbreviated?abbreviations[4]:descriptors[4]}</Text> : <View/> }

                {displayText ? // Acidity
                <Text
                    fill={colors.text}
                    x={circleX(143, 300, 95)}
                    y={circleY(140, 300, 105)}
                    textAnchor="start" 
                    fontSize={abbreviated?22:12}
                >{abbreviated?abbreviations[5]:descriptors[5]}</Text> : <View/> }

                    
                {altValues&&<Polygon 
                    points={shape(altValues)}
                    fill={"#0d0"}
                    fillOpacity={0.5}
                    stroke={colors.text} 
                    mask={"url(#mask)"}
                />}

                <Polygon 
                    points={shape(values)}
                    fill={"#894419"}
                    fillOpacity={0.8}
                    stroke={colors.text} 
                />

            </Svg>
        </View>

    )
}

export default TastingWheel;