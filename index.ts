import Jimp from 'jimp';
import { httpServer } from './src/http_server/index';
import robot, { getMousePos } from 'robotjs';
import { WebSocketServer } from 'ws';

const HTTP_PORT = 3000;
const SOCKET_PORT = 8080;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({
  port: SOCKET_PORT
});

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
  console.log(`Start WebSocket server on the ${SOCKET_PORT} port!`);
  ws.on('message', (data) => {
    console.log('received: %s', data);
    let myData = data.toString('utf8').split(' ');
    let mouse = robot.getMousePos();
    switch (myData[0]) {
      case 'mouse_position':
        ws.send(`mouse_position ${mouse.x}px,${mouse.y}px`);
        break;
      case 'mouse_up':
        ws.send(`mouse_up`);
        robot.moveMouse(mouse.x, mouse.y - Number(myData[1]));
        break;
      case 'mouse_down':
        ws.send(`mouse_down`);
        robot.moveMouse(mouse.x, mouse.y + Number(myData[1]));
        break;
      case 'mouse_left':
        ws.send(`mouse_left`);
        robot.moveMouse(mouse.x - Number(myData[1]), mouse.y);
        break;
      case 'mouse_right':
        ws.send(`mouse_right`);
        robot.moveMouse(mouse.x + Number(myData[1]), mouse.y);
        break;
      case 'draw_circle':
        ws.send(`draw_circle`);
        for (let i = 0; i <= Math.PI * 2; i += 0.01) {
          const x = mouse.x + Number(myData[1]) * (1 - Math.cos(i));
          const y = mouse.y - Number(myData[1]) * Math.sin(i);
          robot.dragMouse(x, y);
        }
        break;
      case 'draw_rectangle':
        ws.send(`draw_rectangle`);
        robot.mouseToggle('down');
        const drawRectangle = async (width: string, length: string) => {
          await drawXY('right', Number(width));
          await drawXY('down', Number(length));
          await drawXY('left', Number(width));
          await drawXY('up', Number(length));
          robot.mouseToggle('up');
        };
        drawRectangle(myData[1], myData[2]);
        break;
      case 'draw_square':
        ws.send(`draw_square`);
        robot.mouseToggle('down');
        const drawSquare = async (width: string) => {
          await drawXY('right', Number(width));
          await drawXY('down', Number(width));
          await drawXY('left', Number(width));
          await drawXY('up', Number(width));
          robot.mouseToggle('up');
        };
        drawSquare(myData[1]);
        break;
      default:
        break;
    }
  });
  ws.send('something');
});

wss.on('close', () => {
  console.log('connection closed');
});
