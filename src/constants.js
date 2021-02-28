const CANVAS_SIZE = [40, 90];
const SNAKE_START = [
  [2, 3],
  [3, 3],
  [4, 3],
];
const APPLE_START = [8, 3];
const SCALE = 20;
const SPEED = 10;
const KEY_PRESS_DIRECTIONS = {
  38: [-1, 0], // up
  40: [1, 0], // down
  37: [0, -1], // left
  39: [0, 1], // right
};

const DIRECTIONS = {
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
};

const STATE = {
  EMPTY: 0,
  SNAKE: 1,
  APPLE: 2,
};
export {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  STATE,
  KEY_PRESS_DIRECTIONS,
  DIRECTIONS,
};
