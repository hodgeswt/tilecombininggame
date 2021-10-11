import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";

import Square from "./Square.js";
import LossScreen from "./LossScreen.js";
import { stylesheet } from "./stylesheet.js";

export default function Grid(props) {
  // 4x4 array of all 0s
  var [grid, setGrid] = useState(
    Array(4)
      .fill(0)
      .map(() => Array(4).fill(0))
  );

  var [score, setScore] = useState(0);

  var [loss, setLoss] = useState(false);

  var generateStart = () => {
    var newGrid = Array(4)
      .fill(0)
      .map(() => Array(4).fill(0));

    var square1 = [
      Math.floor(Math.random() * 4),
      Math.floor(Math.random() * 4),
    ];

    var square2 = [
      Math.floor(Math.random() * 4),
      Math.floor(Math.random() * 4),
    ];

    // Make sure we don't fill the same square twice
    while (square1 === square2) {
      square2 = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
    }

    newGrid[square1[0]][square1[1]] = Math.random() < 0.5 ? 2 : 4;
    newGrid[square2[0]][square2[1]] = Math.random() < 0.5 ? 2 : 4;

    // Update the grid
    setGrid(newGrid);
  };

  useEffect(() => {
    // Fill two random squares with 2 or 4
    generateStart();
  }, []);

  // Control how sensitive the swipes are
  const config = {
    velocityThreshold: 0.1,
    directionalOffsetThreshold: 80,
  };

  var onSwipeUp = () => {
    for (var i = 0; i < 4; i++) {
      grid[i] = grid[i]
        .filter((x) => x !== 0)
        .concat(grid[i].filter((x) => x === 0));
    }
  };

  var onSwipeDown = () => {
    for (var i = 0; i < 4; i++) {
      grid[i] = grid[i]
        .filter((x) => x === 0)
        .concat(grid[i].filter((x) => x !== 0));
    }
  };

  var onSwipeLeft = () => {
    for (var i = 0; i < 4; i++) {
      // extract the row from the column
      // and make sure it's copied
      // so we don't modify the original
      var row = JSON.parse(JSON.stringify(grid.map((x) => x[i])));
      row = row.filter((x) => x !== 0).concat(row.filter((x) => x === 0));

      // put the row back into the column
      for (var j = 0; j < 4; j++) {
        grid[j][i] = row[j];
      }
    }
  };

  var onSwipeRight = () => {
    for (var i = 0; i < 4; i++) {
      // extract the row from the column
      // and make sure it's copied
      // so we don't modify the original
      var row = JSON.parse(JSON.stringify(grid.map((x) => x[i])));
      row = row.filter((x) => x === 0).concat(row.filter((x) => x !== 0));

      // put the row back into the column
      for (var j = 0; j < 4; j++) {
        grid[j][i] = row[j];
      }
    }
  };

  var onSwipe = (direction) => {
    var before = JSON.parse(JSON.stringify(grid));
    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    switch (direction) {
      case SWIPE_UP:
        onSwipeUp();
        detectAddition("up");
        break;
      case SWIPE_DOWN:
        onSwipeDown();
        detectAddition("down");
        break;
      case SWIPE_LEFT:
        onSwipeLeft();
        detectAddition("left");
        break;
      case SWIPE_RIGHT:
        onSwipeRight();
        detectAddition("right");
        break;
      default:
        break;
    }

    if (JSON.stringify(before) !== JSON.stringify(grid)) {
      // Create a new square on the screen
      var square1 = [
        Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 4),
      ];

      // Make sure we don't fill a square that's already full
      while (grid[square1[0]][square1[1]] !== 0) {
        square1 = [
          Math.floor(Math.random() * 4),
          Math.floor(Math.random() * 4),
        ];
      }

      var newGrid = Object.assign([], grid);
      // Make it a two or a four
      newGrid[square1[0]][square1[1]] = Math.random() < 0.5 ? 2 : 4;

      // Sum newGrid and update score
      var sum = 0;
      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
          sum += newGrid[i][j];
        }
      }

      props.setScoreText(sum);
      setScore(sum);

      setLoss(detectLoss());
    }
  };

  var restartGame = () => {
    setLoss(false);
    setGrid(
      Array(4)
        .fill(0)
        .map(() => Array(4).fill(0))
    );
    generateStart();
    props.setScoreText(0);
    setScore(0);
  };

  useEffect(() => {
    restartGame();
  }, [props.restart]);

  var detectAddition = (direction) => {
    switch (direction) {
      case "up":
        // if any two tiles are adjacent and the same, add them together
        for (var i = 0; i < 4; i++) {
          for (var j = 0; j < 3; j++) {
            if (grid[i][j] === grid[i][j + 1]) {
              grid[i][j] = grid[i][j] + grid[i][j + 1];
              grid[i][j + 1] = 0;
            }
          }

          // Float the 0s to the bottom
          grid[i] = grid[i]
            .filter((x) => x !== 0)
            .concat(grid[i].filter((x) => x === 0));
        }
        break;
      case "down":
        // if any two tiles are adjacent and the same, add them together
        for (var i = 0; i < 4; i++) {
          for (var j = 3; j > 0; j--) {
            if (grid[i][j] === grid[i][j - 1]) {
              grid[i][j] = grid[i][j] + grid[i][j - 1];
              grid[i][j - 1] = 0;
            }
          }

          // Float the 0s to the top
          grid[i] = grid[i]
            .filter((x) => x === 0)
            .concat(grid[i].filter((x) => x !== 0));
        }
        break;
      case "left":
        for (var i = 0; i < 4; i++) {
          // extract the row from the column
          // and make sure it's copied
          // so we don't modify the original
          var row = JSON.parse(JSON.stringify(grid.map((x) => x[i])));
          // if any two values are adjacent and the same, add them together
          for (var j = 0; j < 3; j++) {
            if (row[j] === row[j + 1]) {
              row[j] = row[j] + row[j + 1];
              row[j + 1] = 0;
            }
          }

          // Float the 0s to the right
          row = row.filter((x) => x !== 0).concat(row.filter((x) => x === 0));

          // put the row back into the column
          for (var j = 0; j < 4; j++) {
            grid[j][i] = row[j];
          }
        }
        break;
      case "right":
        for (var i = 0; i < 4; i++) {
          // extract the row from the column
          // and make sure it's copied
          // so we don't modify the original
          var row = JSON.parse(JSON.stringify(grid.map((x) => x[i])));
          // if any two values are adjacent and the same, add them together
          for (var j = 3; j > 0; j--) {
            if (row[j] === row[j - 1]) {
              row[j] = row[j] + row[j - 1];
              row[j - 1] = 0;
            }
          }

          // Float 0s to the left
          row = row.filter((x) => x === 0).concat(row.filter((x) => x !== 0));

          // put the row back into the column
          for (var j = 0; j < 4; j++) {
            grid[j][i] = row[j];
          }
        }
        break;
      default:
        break;
    }
  };

  var detectLoss = () => {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if (grid[i][j] === 0) {
          return false;
        }

        if (j < 3) {
          if (grid[i][j] === grid[i][j + 1]) {
            return false;
          }
        }

        if (i < 3) {
          if (grid[i][j] === grid[i + 1][j]) {
            return false;
          }
        }
      }
    }

    return true;
  };

  return (
    // Fill screen with the grid
    // Gesture recognizer detects onSwipe and calls helper function
    <GestureRecognizer
      onSwipe={(direction, state) => onSwipe(direction)}
      config={config}
      style={stylesheet.container}
    >
      {!loss ? (
        grid.map((row, rowIndex) => {
          // For every cell in the grid matrix
          // Return a square with the value of the cell
          return (
            <View key={rowIndex}>
              {row.map((square, squareIndex) => {
                return <Square key={squareIndex} number={square} />;
              })}
            </View>
          );
        })
      ) : (
        <LossScreen score={score} onPress={restartGame} />
      )}
    </GestureRecognizer>
  );
}
