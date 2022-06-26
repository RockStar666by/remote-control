import { httpServer } from './src/http_server/index';
import robot from 'robotjs';
import { createWebSocketStream, WebSocketServer } from 'ws';
import { printScreen } from './src/printScreen/printScreen';
import { drawRectangle } from './src/drawing/drawRectangle';
import { drawSquare } from './src/drawing/drawSquare';
import { drawCircle } from './src/drawing/drawCircle';

const HTTP_PORT = 3000;
const SOCKET_PORT = 8080;

console.log(`Start static http server on port ${HTTP_PORT}...`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer(
  {
    port: SOCKET_PORT
  },
  () => {
    console.log(`Start WebSocket Server on port ${SOCKET_PORT}...`);
  }
);

wss.on('connection', (ws) => {
  process.stdout.write('New Client connected!\n');
  const duplex = createWebSocketStream(ws, { encoding: 'utf8', decodeStrings: false });
  duplex.on('data', async (chunk) => {
    console.log('Received: %s', chunk);
    const [command, value1, value2] = chunk.split(' ');
    const mouse = robot.getMousePos();
    switch (command) {
      case 'mouse_position':
        try {
          const message = `mouse_position ${mouse.x}px,${mouse.y}px \0`;
          duplex.write(message, 'utf8');
          console.log('Result: %s', message);
        } catch (error) {
          console.log(error);
        }
        break;
      case 'mouse_up':
        try {
          robot.moveMouse(mouse.x, mouse.y - Number(value1));
          duplex.write(chunk, 'utf8');
          console.log('Result: %s', chunk);
        } catch (error) {
          console.log(error);
        }
        break;
      case 'mouse_down':
        try {
          robot.moveMouse(mouse.x, mouse.y + Number(value1));
          duplex.write(chunk, 'utf8');
          console.log('Result: %s', chunk);
        } catch (error) {
          console.log(error);
        }
        break;
      case 'mouse_left':
        try {
          robot.moveMouse(mouse.x - Number(value1), mouse.y);
          duplex.write(chunk, 'utf8');
          console.log('Result: %s', chunk);
        } catch (error) {
          console.log(error);
        }
        break;
      case 'mouse_right':
        try {
          robot.moveMouse(mouse.x + Number(value1), mouse.y);
          duplex.write(chunk, 'utf8');
          console.log('Result: %s', chunk);
        } catch (error) {
          console.log(error);
        }
        break;
      case 'draw_circle':
        try {
          await drawCircle(value1);
          duplex.write(chunk, 'utf8');
          console.log('Result: %s', chunk);
        } catch (error) {
          console.log(error);
        }
        break;
      case 'draw_rectangle':
        try {
          await drawRectangle(value1, value2);
          duplex.write(chunk, 'utf8');
          console.log('Result: %s', chunk);
        } catch (error) {
          console.log(error);
        }
        break;
      case 'draw_square':
        try {
          await drawSquare(value1);
          duplex.write(chunk, 'utf8');
          console.log('Result: %s', chunk);
        } catch (error) {
          console.log(error);
        }
        break;
      case 'prnt_scrn':
        try {
          const myString = await printScreen();
          duplex.write(`prnt_scrn ${myString} \0`, 'base64');
          console.log('Result: %s', `prnt_scrn BufferImage \0`);
        } catch (error) {
          console.log(error);
        }
        break;
      default:
        break;
    }
  });
});

wss.on('close', () => {
  process.stdout.write('Closing WebSocket Server connection...\n');
  wss.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  process.stdout.write('Closing WebSocket Server connection...\n');
  wss.close();
  process.exit(0);
});
