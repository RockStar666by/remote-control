import Jimp from 'jimp';
import robot, { getMousePos } from 'robotjs';

export const printScreen = async () => {
  let red: number, green: number, blue: number;

  const mouse = getMousePos();
  const screenShot = robot.screen.capture(mouse.x - 100, mouse.y - 100, 200, 200).image;
  const myImg = new Jimp({ data: screenShot, width: 200, height: 200 });

  screenShot.forEach((byte: number, i: number) => {
    switch (i % 4) {
      case 0:
        return (blue = byte);
      case 1:
        return (green = byte);
      case 2:
        return (red = byte);
      case 3:
        myImg.bitmap.data[i - 3] = red;
        myImg.bitmap.data[i - 2] = green;
        myImg.bitmap.data[i - 1] = blue;
        myImg.bitmap.data[i] = 255;
    }
  });
  return await myImg.getBufferAsync(Jimp.MIME_PNG).then((data) => data.toString('base64'));
};
