const WebSocket = require('ws');
const uuid = require('uuid');

const wss = new WebSocket.Server({ port: 8080 });
const players = {};

class Player {
  constructor(uuid, ws, color) {
    this.uuid = uuid;
    this.ws = ws;
    this.color = color;
  }
}

let whitePlayer = null;
let blackPlayer = null;

wss.on('connection', function connection(ws) {
  if (whitePlayer && blackPlayer) {
    ws.close();
    return;
  }

  const playerId = uuid.v4(); // Generate a unique UUID for the player
  const player = new Player(playerId, ws, null);

  console.log('New client connected');

  if (!whitePlayer) {
    player.color = 'white';
    whitePlayer = player;
    console.log('White player connected');
    ws.send('You are playing as white');
  } else if (!blackPlayer) {
    player.color = 'black';
    blackPlayer = player;
    console.log('Black player connected');
    ws.send('You are playing as black');
  }

  players[playerId] = player;

  ws.on('message', function incoming(message) {
    const recipient = player.color === 'white' ? blackPlayer : whitePlayer;
    if (recipient) {
      recipient.ws.send(message);
      console.log('sent: %s', message);
    }
    console.log('received: %s', message);
  });

  ws.on('close', function() {
    if (player.color === 'white') {
      console.log('White player disconnected');
      whitePlayer = null;
    } else if (player.color === 'black') {
      console.log('Black player disconnected');
      blackPlayer = null;
    }
    delete players[playerId];
  });
});