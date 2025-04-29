'use client';

import { useState } from 'react';
import styles from './page.module.css';
console.log('check');
export default function Home() {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  const [turnColor, setTurnColor] = useState(1);

  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const onearrow = (y: number, x: number, y_direction: number, x_direction: number) => {
    const candidate = [];
    let flag = 0;
    for (
      let i = y, p = x;
      board[i] !== undefined &&
      board[i][p] !== undefined &&
      (board[i][p] !== 0 || flag === 0) &&
      !(board[i][p] !== 0 && flag === 0);
      i += y_direction, p += x_direction
    ) {
      if (board[i][p] === turnColor) {
        if (2 <= flag) {
          console.log('check commit');
          return candidate;
        }
        break;
      }
      candidate.push([i, p]);
      flag += 1;
    }
    return [];
  };

  const eightarrow = (x: number, y: number) => {
    let candidate: number[][] = [];
    for (const direction of directions) {
      console.log(direction);
      candidate = [...candidate, ...onearrow(y, x, direction[0], direction[1])];
    }
    console.log(candidate);
    console.log('check1');
    if (candidate.length > 0) {
      const newBoard = structuredClone(board);
      for (const c of candidate) {
        newBoard[c[0]][c[1]] = turnColor;
      }
      setBoard(newBoard);
      console.log('check2');
      setTurnColor(2 / turnColor);
    }
  };

  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    eightarrow(x, y);
  };
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
              {color !== 0 && (
                <div
                  className={styles.stone}
                  style={{ background: color === 1 ? `#000` : `#fff` }}
                />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
