'use client';

import React, { useState } from 'react';
import { Chess } from 'chess.js';
import { Square } from 'chess.js';

const pieceImages: { [key: string]: string } = {
  bp: 'b_p.png',
  br: 'b_r.png',
  bn: 'b_n.png',
  bb: 'b_b.png',
  bq: 'b_q.png',
  bk: 'b_k.png',
  wp: 'w_p.png',
  wr: 'w_r.png',
  wn: 'w_n.png',
  wb: 'w_b.png',
  wq: 'w_q.png',
  wk: 'w_k.png',
};

const Chessboard: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  const handleSquareClick = (x: number, y: number) => {
    const file = String.fromCharCode('a'.charCodeAt(0) + x);
    const rank = (8 - y).toString();
    const square: Square = file + rank as Square;
    const turn = game.turn();

    if (selectedSquare) {
      if (selectedSquare === square) {
        return setSelectedSquare(null);
      }
      try {
        handleMove(selectedSquare, square);
        setSelectedSquare(null);
      } catch (error) {
        console.error(error);
        setSelectedSquare(null);
      }
    } else {
      if (game.get(square)) {
        if (game.get(square)?.color === turn) {
          setSelectedSquare(square);
      }
    }
      return;
    }
  };

  const handleMove = (from: string, to: string) => {
    const move = game.move({ from, to });
    if (move) {
      setGame(new Chess(game.fen())); // Update the game state
    }
  };

  const renderSquare = (piece: any, x: number, y: number) => {
    const isSelected = selectedSquare === `${String.fromCharCode('a'.charCodeAt(0) + x)}${8 - y}`;
    return (
      <div
        key={`${x}-${8 - y}`}
        onClick={() => handleSquareClick(x, y)}
        className={`w-20 h-20 flex items-center justify-center justify-items-center ${x % 2 === y % 2 ? 'bg-gray-300' : 'bg-white'} ${isSelected ? 'border-4 border-blue-500' : ''}`}
      >
        {piece && <img src={`/pieces/${pieceImages[(piece.color) + piece.type]}`} alt={piece.type} className="w-16 h-16" />}
      </div>
    );
  };

  const renderBoard = () => {
    const boardSetup = game.board();
    return (
      <div className="grid grid-cols-8 gap-0">
        {boardSetup.slice().map((row, y) => (
          row.map((square, x) => renderSquare(square ? square : '', x, y))
        ))}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center">
      {renderBoard()}
    </div>
  );
};

export default Chessboard;
