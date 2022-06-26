import robot, { getMousePos } from 'robotjs';

export const drawXY = async (direction: string, length: number) => {
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
