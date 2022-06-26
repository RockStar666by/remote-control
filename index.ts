import { httpServer } from './src/http_server/index';
import robot, { getMousePos } from 'robotjs';
import { createWebSocketStream, WebSocketServer } from 'ws';
import { printScreen } from './src/printScreen/printScreen';

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

const drawXY = async (direction: string, length: number) => {
  const mouse = getMousePos();
  switch (direction) {
    case 'right':
      for (let i = 0; i <= length; i += 1) {
        const x = mouse.x + i;
        robot.dragMouse(x, mouse.y);
      }
      break;
    case 'left':
      for (let i = 0; i <= length; i += 1) {
        const x = mouse.x - i;
        robot.dragMouse(x, mouse.y);
      }
      break;
    case 'down':
      for (let i = 0; i <= length; i += 1) {
        const y = mouse.y + i;
        robot.dragMouse(mouse.x, y);
      }
      break;
    case 'up':
      for (let i = 0; i <= length; i += 1) {
        const y = mouse.y - i;
        robot.dragMouse(mouse.x, y);
      }
      break;
    default:
      break;
  }
};

wss.on('connection', (ws) => {
  process.stdout.write('New Client connected!\n');
  const duplex = createWebSocketStream(ws, { encoding: 'utf8', decodeStrings: false });
  duplex.on('data', async (chunk) => {
    console.log('received: %s', chunk);
    const [command, value1, value2] = chunk.split(' ');
    const mouse = robot.getMousePos();
    switch (command) {
      case 'mouse_position':
        const message = `mouse_position ${mouse.x}px,${mouse.y}px \0`;
        duplex.write(message, 'utf8');
        break;
      case 'mouse_up':
        robot.moveMouse(mouse.x, mouse.y - Number(value1));
        break;
      case 'mouse_down':
        robot.moveMouse(mouse.x, mouse.y + Number(value1));
        break;
      case 'mouse_left':
        robot.moveMouse(mouse.x - Number(value1), mouse.y);
        break;
      case 'mouse_right':
        robot.moveMouse(mouse.x + Number(value1), mouse.y);
        break;
      case 'draw_circle':
        for (let i = 0; i <= Math.PI * 2; i += 0.01) {
          const x = mouse.x + Number(value1) * (1 - Math.cos(i));
          const y = mouse.y - Number(value1) * Math.sin(i);
          robot.dragMouse(x, y);
        }
        break;
      case 'draw_rectangle':
        robot.mouseToggle('down');
        const drawRectangle = async (width: string, length: string) => {
          await drawXY('right', Number(width));
          await drawXY('down', Number(length));
          await drawXY('left', Number(width));
          await drawXY('up', Number(length));
          robot.mouseToggle('up');
        };
        drawRectangle(value1, value2);
        break;
      case 'draw_square':
        robot.mouseToggle('down');
        const drawSquare = async (width: string) => {
          await drawXY('right', Number(width));
          await drawXY('down', Number(width));
          await drawXY('left', Number(width));
          await drawXY('up', Number(width));
          robot.mouseToggle('up');
        };
        drawSquare(value1);
        break;
      case 'prnt_scrn':
        const myString = await printScreen();
        duplex.write(`prnt_scrn ${myString}`, 'base64');
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
