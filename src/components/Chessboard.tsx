'use client';

import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Square } from 'chess.js';

// Map for piece images
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
  const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);

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
      const reader = new FileReader();
      reader.onload = async () => {
        const message = reader.result as string;
        try {
          const move = JSON.parse(message);
          if (move && move.from && move.to) {
            const chessMove = { from: move.from, to: move.to };
            const result = game.move(chessMove);
            if (result) {
              setGame(new Chess(game.fen()));
              checkGameOver();
            }
          }
        } catch (error) {
          console.error('Received non-JSON message:', message);
        }
      };
      reader.readAsText(event.data);
    };

    return () => {
      ws.close();
    };
  }, [game]);

  const handleSquareClick = (x: number, y: number) => {
    const file = isPlayerBlack ? String.fromCharCode('a'.charCodeAt(0) + 7 - x) : String.fromCharCode('a'.charCodeAt(0) + x)
    const rank = isPlayerBlack ? (y + 1).toString() : (8 - y).toString();
    console.log(file, rank);
    const square: Square = file + rank as Square;
    const turn = game.turn();
    console.log(isPlayerBlack, turn, square, selectedSquare);
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
      checkGameOver();
    }
  };

  const checkGameOver = () => {
    if (game.isCheckmate()) {
      setGameOverMessage('Checkmate! Game Over.');
    } else if (game.isDraw()) {
      setGameOverMessage('Draw! Game Over.');
    } else if (game.isStalemate()) {
      setGameOverMessage('Stalemate! Game Over.');
    } else if (game.isThreefoldRepetition()) {
      setGameOverMessage('Threefold Repetition! Game Over.');
    } else if (game.isInsufficientMaterial()) {
      setGameOverMessage('Insufficient Material! Game Over.');
    }
  };

  const renderSquare = (piece: any, x: number, y: number) => {
    const file = isPlayerBlack ? String.fromCharCode('a'.charCodeAt(0) + 7 - x) : String.fromCharCode('a'.charCodeAt(0) + x)
    const rank = isPlayerBlack ? (y + 1).toString() : (8 - y).toString();
    const squareName = `${file}${rank}`;
    const isSelected = selectedSquare === squareName;

    const isDarkSquare = (x + y) % 2 === 1;
    const squareColorClass = isDarkSquare ? 'bg-gray-300' : 'bg-white';

    return (
      <div
        key={`${x}-${y}`}
        onClick={() => handleSquareClick(x, y)}
        className={`w-20 h-20 flex items-center justify-center ${squareColorClass} ${isSelected ? 'border-4 border-blue-500' : ''}`}
      >
        {piece && <img src={`/pieces/${pieceImages[(piece.color) + piece.type]}`} alt={piece.type} className="w-16 h-16" />}
      </div>
    );
  };

  const renderBoard = () => {
    const boardSetup = game.board();
    return (
      <div className="grid grid-cols-8 gap-0">
        {isPlayerBlack
          ? boardSetup
              .slice()
              .reverse()
              .map((row, y) =>
                row
                  .slice()
                  .reverse()
                  .map((square, x) => renderSquare(square ? square : '', x, y))
              )
          : boardSetup.map((row, y) =>
              row.map((square, x) => renderSquare(square ? square : '', x, y))
            )}
      </div>
    );
  };
  
  const renderRankLabels = () => {
    const labels = isPlayerBlack ? ['1', '2', '3', '4', '5', '6', '7', '8'] : ['8', '7', '6', '5', '4', '3', '2', '1'];
    return labels.map((label, index) => (
      <div key={index} className="h-20 flex items-center justify-center">
        {label}
      </div>
    ));
  };

  const renderFileLabels = () => {
    const labels = isPlayerBlack ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return labels.map((label, index) => (
      <div key={index} className="w-20 flex items-center justify-center">
        {label}
      </div>
    ));
  };

  return (
    <div className="flex items-center justify-center">
      <div className="grid grid-rows-[auto_1fr_auto]">
        {}
        <div className="grid grid-cols-10 gap-0">
          <div className="h-20"></div> {}
          {renderFileLabels()}
        </div>

        {}
        <div className="grid grid-cols-10 gap-0">
          <div className="flex flex-col justify-between">
            {renderRankLabels()}
          </div>
          <div className="col-span-8">
            {renderBoard()}
          </div>
          <div className="flex flex-col justify-between">
            {renderRankLabels()}
          </div>
        </div>

        {}
        <div className="grid grid-cols-10 gap-0">
          <div className="h-20"></div> {}
          {renderFileLabels()}
        </div>
      </div>

      {gameOverMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold">{gameOverMessage}</h2>
            <button
              onClick={() => setGameOverMessage(null)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chessboard;
