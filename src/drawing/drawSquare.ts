import robot from 'robotjs';
import { drawXY } from '../drawing/drawXY';

export const drawSquare = async (width: string) => {
  robot.mouseToggle('down');
  await drawXY('right', Number(width));
  await drawXY('down', Number(width));
  await drawXY('left', Number(width));
  await drawXY('up', Number(width));
  robot.mouseToggle('up');
};
