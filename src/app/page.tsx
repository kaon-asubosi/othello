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

  const search_arrow = (y: number, x: number, y_direction: number, x_direction: number) => {
    let flag = 0;
    for (
      let i = y, p = x;
      board[i] !== undefined &&
      board[i][p] !== undefined &&
      ((board[i][p] !== turnColor && board[i][p] !== 3) || flag === 0) &&
      !(board[i][p] !== turnColor && flag === 0);
      i += y_direction, p += x_direction
    ) {
      if (board[i][p] === 0) {
        if (2 <= flag) {
          return [[i, p]];
        }
        break;
      }
      flag += 1;
    }
    return [];
  };

  const search_eight_arrow = (y: number, x: number) => {
    let candidate: number[][] = [];
    for (const direction of directions) {
      candidate = [...candidate, ...search_arrow(y, x, direction[0], direction[1])];
    }
    if (candidate.length > 0) {
      const newBoard = structuredClone(board);
      for (const c of candidate) {
        newBoard[c[0]][c[1]] = 3;
      }
      setBoard(newBoard);
    }
  };

  const search = () => {
    for (let i = 0; i < 8; i++) {
      for (let p = 0; p < 8; p++) {
        if (board[i][p] === turnColor) {
          search_eight_arrow(i, p);
        }
      }
    }
  };

  const onearrow = (y: number, x: number, y_direction: number, x_direction: number) => {
    const candidate = [];
    let flag = 0;
    for (
      let i = y, p = x;
      board[i] !== undefined &&
      board[i][p] !== undefined &&
      ((board[i][p] !== 0 && board[i][p] !== 3) || flag === 0) &&
      !(board[i][p] !== 3 && flag === 0);
      i += y_direction, p += x_direction
    ) {
      console.log('check2', i, p, board[i][p]);
      if (board[i][p] === turnColor) {
        if (2 <= flag) {
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
      candidate = [...candidate, ...onearrow(y, x, direction[0], direction[1])];
    }
    if (candidate.length > 0) {
      const newBoard = structuredClone(board);
      for (const c of candidate) {
        newBoard[c[0]][c[1]] = turnColor;
      }
      setBoard(newBoard);
      setTurnColor(2 / turnColor);
    }
  };

  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    eightarrow(x, y);
    search();
  };
  search();
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
              {color !== 0 && (
                <div
                  className={styles.stone}
                  style={{ background: color === 1 ? `#000` : color === 2 ? `#fff` : `#ff0` }}
                />
              )}
            </div>
          )),
        )}
      </div>
      <div className={styles.score}>スコア</div>
    </div>
  );
}
