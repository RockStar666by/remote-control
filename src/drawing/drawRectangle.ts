import robot from 'robotjs';
import { drawXY } from '../drawing/drawXY';

export const drawRectangle = async (width: string, length: string) => {
  robot.mouseToggle('down');
  await drawXY('right', Number(width));
  await drawXY('down', Number(length));
  await drawXY('left', Number(width));
  await drawXY('up', Number(length));
  robot.mouseToggle('up');
};
