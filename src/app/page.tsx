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

  const static_next = (taskColor: number, newBoard: number[][]) => {
    return static_candidate(taskColor, newBoard)
      .flat(Infinity)
      .some((color) => color === 3);
  };

  const static_candidate = (taskColor: number, boardwithCandidates: number[][]) => {
    boardwithCandidates.map((row, y) =>
      row.map((color, x) => {
        if (boardwithCandidates[y][x] === taskColor)
          for (const direction of directions) {
            let flag = 0;
            for (
              let i = y + direction[0], p = x + direction[1];
              boardwithCandidates[i] !== undefined &&
              boardwithCandidates[i][p] !== undefined &&
              boardwithCandidates[i][p] !== taskColor &&
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
      console.log(board[i][p]);
      console.log(turnColor);
      if (board[i][p] === turnColor) {
        console.log('check1');
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
    console.log(board);
    let candidate: number[][] = [];
    for (const direction of directions) {
      candidate = [...candidate, ...onearrow(y, x, direction[0], direction[1])];
    }
    const newBoard = structuredClone(board);
    if (candidate.length > 0) {
      for (const c of candidate) {
        newBoard[c[0]][c[1]] = turnColor;
      }
      setBoard(newBoard);
      return newBoard;
    }
    return newBoard;
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
    const oldboard = board.flat(Infinity).join(' ');
    const resultboard = structuredClone(eightarrow(x, y));
    const flag = resultboard.flat(Infinity).join(' ') !== oldboard; //boardと比較して変わっていたら更新できていたとする
    if (static_next(2 / turnColor, resultboard) && flag) {
      setTurnColor(2 / turnColor);
    } else {
      if (static_next(turnColor, resultboard)) {
        if (flag) {
          console.log('置ける場所がありません');
          alert('置ける場所がありません');
        } else {
          console.log('置ける場所に置いてください');
        }
      } else {
        console.log('双方置ける場所がないため強制終了です');
        alert('双方置ける場所がないため強制終了です');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {static_candidate(turnColor, structuredClone(board)).map((row, y) =>
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
