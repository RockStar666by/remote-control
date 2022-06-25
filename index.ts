import Jimp from 'jimp';
import { httpServer } from './src/http_server/index';
import robot from 'robotjs';
import { WebSocketServer } from 'ws';

const HTTP_PORT = 3000;
const SOCKET_PORT = 8080;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({
  port: SOCKET_PORT
});

wss.on('connection', (ws) => {
  console.log(`Start WebSocket server on the ${SOCKET_PORT} port!`);
  ws.on('message', (data) => {
    console.log('recieved: %s', data);
  });
  ws.send('something');
});

wss.on('close', () => {
  console.log('connection closed');
});
