const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
let whitePlayer = null;
let blackPlayer = null;

wss.on('connection', function connection(ws) {
  if (whitePlayer && blackPlayer) {
    ws.close();
    return;
  }

  console.log('New client connected');

  if (!whitePlayer) {
    whitePlayer = ws;
    console.log('White player connected');
    ws.send('You are playing as white');
  } else if (!blackPlayer) {
    blackPlayer = ws;
    console.log('Black player connected');
    ws.send('You are playing as black');
  }

  ws.on('message', function incoming(message) {
    const recipient = ws === whitePlayer ? blackPlayer : whitePlayer;
    if (recipient) {
      recipient.send(message);
      console.log('sent: %s', message);
    }
    console.log('received: %s', message);
  });

  ws.on('close', function() {
    if (ws === whitePlayer) {
      console.log('White player disconnected');
      whitePlayer = null;
    } else if (ws === blackPlayer) {
      console.log('Black player disconnected');
      blackPlayer = null;
    }
  });
});
