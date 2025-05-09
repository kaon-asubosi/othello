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

  //改造計画
  //次の色が置けるかを静的に探知するプログラムを作る return true or false
  //押したときに色を変えられるかを静的に探知するプログラムを作る return true or false
  //それらのプログラムをclickHandlerで実行し次のターンのスキップと置かないプログラムを作る
  //clickHandler=>置けるか静的探知=>false:次の入力待ち,true:置き換える=>
  //置き換えたボードを元に次の色が置けるか静的探知=>false:色を変えずに通知を出す:true:色を変える=>予測地点を表示=>
  //値を更新

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

  const static_next = (newboard: number[][]) => {};

  const static_reverce = (newboard: number[][], x: number, y: number) => {};

  const static_candidate = () => {
    const boardwithCandidates = structuredClone(board);
    boardwithCandidates.map((row, y) =>
      row.map((color, x) => {
        if (boardwithCandidates[y][x] === turnColor)
          for (const direction of directions) {
            let flag = 0;
            for (
              let i = y + direction[0], p = x + direction[1];
              boardwithCandidates[i] !== undefined &&
              boardwithCandidates[i][p] !== undefined &&
              boardwithCandidates[i][p] !== turnColor &&
              boardwithCandidates[i][p] !== 3;
              i += direction[0], p += direction[1]
            ) {
              if (boardwithCandidates[i][p] === 0) {
                if (1 <= flag) {
                  boardwithCandidates[i][p] = 3;
                  break;
                } else {
                  break;
                }
              }
              flag += 1;
            }
          }
      }),
    );
    return boardwithCandidates;
  };

  const calcpoint = (color: number) => {
    return board.flat(Infinity).filter((col) => col === color).length;
  };

  // const search_arrow = (y: number, x: number, y_direction: number, x_direction: number) => {
  //   let flag = 0;
  //   for (
  //     let i = y, p = x;
  //     board[i] !== undefined &&
  //     board[i][p] !== undefined &&
  //     ((board[i][p] !== turnColor && board[i][p] !== 3) || flag === 0) &&
  //     !(board[i][p] !== turnColor && flag === 0);
  //     i += y_direction, p += x_direction
  //   ) {
  //     if (board[i][p] === 0) {
  //       if (2 <= flag) {
  //         return [[i, p]];
  //       }
  //       break;
  //     }
  //     flag += 1;
  //   }
  //   return [];
  // };

  // const search_eight_arrow = (y: number, x: number) => {
  //   let candidate: number[][] = [];
  //   for (const direction of directions) {
  //     candidate = [...candidate, ...search_arrow(y, x, direction[0], direction[1])];
  //   }
  //   if (candidate.length > 0) {
  //     const newBoard = structuredClone(board);
  //     for (const c of candidate) {
  //       newBoard[c[0]][c[1]] = 3;
  //     }
  //     setBoard(newBoard);
  //   }
  // };

  // const search = () => {
  //   for (let i = 0; i < 8; i++) {
  //     for (let p = 0; p < 8; p++) {
  //       if (board[i][p] === turnColor) {
  //         search_eight_arrow(i, p);
  //       }
  //     }
  //   }
  // };

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
    const newBoard = structuredClone(board);
    if (candidate.length > 0) {
      for (const c of candidate) {
        newBoard[c[0]][c[1]] = turnColor;
      }
      setTurnColor(2 / turnColor);
      setBoard(newBoard);
    }
  };

  // const clean_scan = (newBoard: number[][]) => {
  //   for (let i = 0; i < 8; i++) {
  //     for (let p = 0; p < 8; p++) {
  //       if (newBoard[i][p] === 3) {
  //         newBoard[i][p] = 0;
  //       }
  //     }
  //   }
  //   setBoard(newBoard);
  // };

  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    eightarrow(x, y);
  };
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {static_candidate().map((row, y) =>
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
      <div className={styles.score}>
        <div />
        <div className={styles.scorebox}>
          <div className={styles.black}>{calcpoint(1)}</div>
          <div className={styles.white}>{calcpoint(2)}</div>
        </div>
      </div>
    </div>
  );
}
