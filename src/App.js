import "./App.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { produce } from "immer";
import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  KEY_PRESS_DIRECTIONS,
  STATE,
  DIRECTIONS,
} from "./constants";
const [rowSize, colSize] = CANVAS_SIZE;
function App() {
  const [apple, setApple] = useState(APPLE_START);
  const [snake, setSnake] = useState(SNAKE_START);
  const [direction, setDirection] = useState(DIRECTIONS.DOWN);
  const [grid, setGrid] = useState(() => {
    const rows = [];
    const snakeSet = new Set();
    SNAKE_START.forEach((x) => snakeSet.add(JSON.stringify(x)));
    for (let i = 0; i < rowSize; i++) {
      rows.push(
        Array.from(Array(colSize), (value, j) => {
          const [ax, ay] = apple;
          if (i === ax && j === ay) return STATE.APPLE;
          else if (snakeSet.has(JSON.stringify([i, j]))) return STATE.SNAKE;
          else return 0;
        })
      );
    }
    return rows;
  });

  const directionRef = useRef(direction);
  directionRef.current = direction;
  const appleRef = useRef(apple);
  appleRef.current = apple;
  const moveSnake = () => {
    runSimulation();
  };

  const onKeyDown = ({ which }) => {
    if (which in KEY_PRESS_DIRECTIONS) {
      if (directionRef.current === DIRECTIONS.UP && which === DIRECTIONS.DOWN)
        return;
      if (directionRef.current === DIRECTIONS.DOWN && which === DIRECTIONS.UP)
        return;
      if (
        directionRef.current === DIRECTIONS.LEFT &&
        which === DIRECTIONS.RIGHT
      )
        return;
      if (
        directionRef.current === DIRECTIONS.RIGHT &&
        which === DIRECTIONS.LEFT
      )
        return;
      directionRef.current = which;
      setDirection(which);
    }
  };
  const getRandomRowColumn = useCallback(() => {
    return [
      Math.floor(Math.random() * rowSize),
      Math.floor(Math.random() * colSize),
    ];
  }, []);
  useEffect(() => document.addEventListener("keydown", onKeyDown), []);
  useEffect(() => {
    const appleStr = `(${apple[0]}, ${apple[1]})`;
    const excluded = new Set([]);
    snake.forEach((s) => {
      const str = `(${s[0]}, ${s[1]})`;
      if (!excluded.has(str)) excluded.add(str);
    });
    if (excluded.has(appleStr)) {
      let [row, col] = getRandomRowColumn();
      while (excluded.has(`(${row}, ${col})`)) {
        [row, col] = getRandomRowColumn();
      }
      appleRef.current = [row, col];
      setApple([row, col]);
    }
  }, [getRandomRowColumn, apple, snake]);

  useEffect(() => {
    const rows = [];
    const snakeSet = new Set();
    snake.forEach((x) => snakeSet.add(JSON.stringify(x)));
    for (let i = 0; i < rowSize; i++) {
      rows.push(
        Array.from(Array(colSize), (value, j) => {
          const [ax, ay] = apple;
          if (i === ax && j === ay) return STATE.APPLE;
          else if (snakeSet.has(JSON.stringify([i, j]))) return STATE.SNAKE;
          else return 0;
        })
      );
    }
    setGrid(rows);
  }, [snake, apple]);
  useEffect(() => {
    let dir = directionRef.current;
    const [tx, ty] = snake[0];
    if (directionRef.current === DIRECTIONS.LEFT) {
      if (tx === 0 && ty === 0) dir = DIRECTIONS.DOWN;
      else if (ty === 0) dir = DIRECTIONS.UP;
    } else if (directionRef.current === DIRECTIONS.RIGHT) {
      if (tx === rowSize - 1 && ty === colSize - 1) dir = DIRECTIONS.UP;
      else if (ty === colSize - 1) dir = DIRECTIONS.DOWN;
    } else if (directionRef.current === DIRECTIONS.DOWN) {
      if (tx === rowSize - 1 && ty === colSize - 1) dir = DIRECTIONS.LEFT;
      else if (tx === rowSize - 1) dir = DIRECTIONS.RIGHT;
    } else if (directionRef.current === DIRECTIONS.UP) {
      if (tx === 0 && ty === colSize - 1) dir = DIRECTIONS.LEFT;
      else if (tx === 0) dir = DIRECTIONS.RIGHT;
    }
    if (dir !== directionRef.current) {
      setDirection(dir);
      directionRef.current = DIRECTIONS.DOWN;
    }
  }, [snake]);

  const runSimulation = useCallback(() => {
    const [dx, dy] = KEY_PRESS_DIRECTIONS[directionRef.current];
    setSnake((snake) => {
      return produce(snake, (copy) => {
        const [tx, ty] = copy[0];

        const newHead = [tx + dx, ty + dy];
        if (
          !(
            appleRef.current[0] === newHead[0] &&
            appleRef.current[1] === newHead[1]
          )
        ) {
          copy.pop();
        }
        copy.unshift(newHead);
      });
    });
    setTimeout(runSimulation, SPEED);
  }, []);

  return (
    <div className="App">
      <button tabIndex="0" onClick={(e) => moveSnake(e)}>
        Start
      </button>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${colSize}, ${SCALE}px)`,
        }}
      >
        {grid.map((rows, ri) => {
          return rows.map((cols, ci) => {
            return (
              <div
                key={`${ri}-${ci}`}
                className={
                  grid[ri][ci] === 1
                    ? "snake"
                    : grid[ri][ci] === 2
                    ? "apple"
                    : "grid-cell"
                }
                style={{
                  width: SCALE,
                  height: SCALE,
                }}
              ></div>
            );
          });
        })}
      </div>
    </div>
  );
}

export default App;
