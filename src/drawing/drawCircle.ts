import robot, { getMousePos } from 'robotjs';

export const drawCircle = async (radius: string) => {
  const mouse = getMousePos();
  robot.mouseToggle('down');
  for (let i = 0; i <= Math.PI * 2; i += 0.01) {
    const x = mouse.x + Number(radius) * (1 - Math.cos(i));
    const y = mouse.y - Number(radius) * Math.sin(i);
    robot.dragMouse(x, y);
  }
  robot.mouseToggle('up');
};
