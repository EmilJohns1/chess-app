'use client';

import React, { useState, useEffect } from 'react';
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
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isPlayerBlack, setIsPlayerBlack] = useState<boolean>(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    ws.onopen = () => {
      setSocket(ws);
    };
    ws.onmessage = async (event) => {
      const message = event.data;
      if (message === 'You are playing as black') {
        setIsPlayerBlack(true);
        return;
      }
      if (message === 'You are playing as white') {
        setIsPlayerBlack(false);
        return;
      }
      const reader = new FileReader(); // FileReader object to read Blob as text
      reader.onload = async () => {
        const message = reader.result as string; // Read the Blob as text and assert it as string
        try {
          const move = JSON.parse(message);
          if (move && move.from && move.to) {
            const chessMove = { from: move.from, to: move.to };
            const result = game.move(chessMove);
            if (result) {
              setGame(new Chess(game.fen()));
            }
          }
        } catch (error) {
          console.error('Received non-JSON message:', message);
        }
      };
      reader.readAsText(event.data); // Read the Blob as text
    };
    
    return () => {
      ws.close();
    };
  }, [game]);

  const handleSquareClick = (x: number, y: number) => {
    const file = String.fromCharCode('a'.charCodeAt(0) + x);
    const rank = (8 - y).toString();
    const square: Square = file + rank as Square;
    const turn = game.turn();
    console.log(isPlayerBlack, turn, square, selectedSquare)
    if (isPlayerBlack && turn === 'w') {
      return;
    } else if (!isPlayerBlack && turn === 'b') {
      return;
    }

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
    if (move && socket) {
      socket.send(JSON.stringify({ from, to }));
      setGame(new Chess(game.fen()));
    }
  };

  const renderSquare = (piece: any, x: number, y: number) => {
    const highlightedY = isPlayerBlack ? y + 1 : 8 - y;
    const isSelected = selectedSquare === `${String.fromCharCode('a'.charCodeAt(0) + x)}${highlightedY}`;
    const adjustedY = isPlayerBlack ? 7 - y : y;
    return (
      <div
        key={`${x}-${adjustedY}`}
        onClick={() => handleSquareClick(x, adjustedY)}
        className={`w-20 h-20 flex items-center justify-center justify-items-center ${x % 2 === adjustedY % 2 ? 'bg-gray-300' : 'bg-white'} ${isSelected ? 'border-4 border-blue-500' : ''}`}
      >
        {piece && <img src={`/pieces/${pieceImages[(piece.color) + piece.type]}`} alt={piece.type} className="w-16 h-16" />}
      </div>
    );
  };

  const renderBoard = () => {
    const boardSetup = game.board();
    return (
      <div className="grid grid-cols-8 gap-0">
        {isPlayerBlack ? 
          boardSetup.slice().reverse().map((row, y) => (
            row.map((square, x) => renderSquare(square ? square : '', x, y))
          ))
        :
          boardSetup.slice().map((row, y) => (
            row.map((square, x) => renderSquare(square ? square : '', x, y))
          ))
        }
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
