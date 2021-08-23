const { nativeImage } = require('electron');
const path = require('path');

const getAppIcon = () => {
  const iconPath = path.join(__dirname, 'build/icon.png');
  return nativeImage.createFromPath(iconPath);
};

module.exports = getAppIcon;
