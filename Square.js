import React from 'react';
import { View, Text, Dimensions } from 'react-native';

export default function Square(props) {

    // Determine square size based on screen size
    // Divide by N+1 columns to make room for whitespace
    const squareSize = Math.floor(Dimensions.get('window').width / 5);

    // Determine highest power of two
    // That is less than or equal to our number
    var highestPowOfTwo = (number) => {
        var pow = 0;
        while (number > 1) {
            number >>= 1;
            pow++;
        }
        return pow;
    }

    var number = props.number;

    if (number !== 0) {
        // Number starts as light pink, darkens based on power of 2
        var color = parseInt('FFA400', 16);
        let pow = highestPowOfTwo(number);
        // darken color based on pow
        color -= pow * parseInt('0F0F0F', 16);
    } else {
        // Number is 0, so color is off-white
        color = parseInt('E6E6E6', 16);
    }

    const styles = {
        square: {
            backgroundColor: '#' + color.toString(16),
            width: squareSize,
            height: squareSize,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 5,
            border: '1px solid black'
        }
    }

    // Return a square with our number written in white
    // Unless the number is 0, then return a square with no number
    return (
        <View style={styles.square}>
            <Text style={{color: 'white'}}>{number !== 0 ? number : ""}</Text>
        </View>
    )
}