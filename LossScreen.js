import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { stylesheet } from "./stylesheet";

export default function LossScreen(props) {
  return (
    <View>
      <Text style={stylesheet.text}>You lost!</Text>
      <Text style={stylesheet.text}>Final score: {props.score}</Text>
      <TouchableOpacity style={stylesheet.button} onPress={props.onPress}>
        <Text>Play Again</Text>
      </TouchableOpacity>
    </View>
  );
}
