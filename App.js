import React, { useState, useEffect } from "react";
import {
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView
} from "react-native";

import Grid from "./Grid.js";
import { stylesheet } from "./stylesheet.js";

export default function App() {
  var [score, setScoreText] = useState(0);
  var [restart, setRestart] = useState(false);
  var [offset, setOffset] = useState(0);

  var scoreBackground = {
    backgroundColor: "#DDDDDD",
    padding: 10 + offset,
    marginBottom: 10,
  }

  return (
    <>
      <SafeAreaView
        onLayout={(event) => {
          var { height } = event.nativeEvent.layout;
          setOffset(height);
        }}
      >
        <StatusBar hidden={true} />
        <View style={stylesheet.scoreBackground}>
          <Text style={stylesheet.score}>Score: {score}</Text>
        </View>
        <TouchableOpacity
          style={stylesheet.button}
          onPress={() => setRestart(!restart)}
        >
          <Text style={stylesheet.text}>Restart</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <Grid setScoreText={setScoreText} restart={restart} />
    </>
  );
}
