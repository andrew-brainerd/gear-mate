const fs = require('fs');
const log = require('electron-log');
const { ADDON_LIST } = require('./constants');
const { downloadRepo } = require('./utils/download');
const { getAddonPath, getAddonsPath, hasValidGamePath } = require('./utils/paths');

const initializeAddons = async () => {
  if (hasValidGamePath()) {
    return downloadAddons(ADDON_LIST, getAddonsPath());
  } else {
    return new Error('Invalid game path');;
  }
};

const hasAddonInstalled = addon => {
  return fs.existsSync(getAddonPath(addon));
};

const hasLatestAddonVersion = addonName => {
  return false;
};

const downloadAddon = async (addonName, addonDir) => {
  log.info(`Downloading Addon ${addonName} to ${addonDir}`);
  return downloadRepo(addonName, `${addonDir}\\${addonName}`);
};

const downloadAddons = async (addonList, addonsDir) => {
  await Promise.all(addonList.map(async addon => {
    if (hasAddonInstalled(addon) && !hasLatestAddonVersion(addon)) {
      log.info(`Removing installed ${addon} addon`);9
      fs.rmdirSync(`${addonsDir}\\${addon}`, { recursive: true });
    }
    fs.mkdirSync(`${addonsDir}\\${addon}`);
    await downloadAddon(addon, addonsDir).then(() => {
      log.info(`Installed ${addon} Addon`);
    });
  }));
};

module.exports = {
  initializeAddons
};
