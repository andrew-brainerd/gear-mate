const fs = require('fs');
const log = require('electron-log');
const { downloadRepo } = require('./utils/download');
const { getAddonPath, getAddonsPath } = require('./utils/paths');

const initializeAddons = async () => {
  if (!hasGearMateInstalled() || !hasGuildMateInstalled()) {
    return downloadAddons(getAddonsPath());
  }
};

const hasGearMateInstalled = () => {
  return fs.existsSync(getAddonPath('TentativeGearMate'));
};

const hasGuildMateInstalled = () => {
  return fs.existsSync(getAddonPath('TentativeGuildMate'));
};

const downloadAddon = async (addonName, addonDir) => {
  log.info(`Downloading Addon ${addonName} to ${addonDir}`);
  return downloadRepo(addonName, `${addonDir}\\${addonName}`);
};

const downloadAddons = async addonsDir => {
  if (!hasGuildMateInstalled()) {
    fs.mkdirSync(`${addonsDir}\\TentativeGuildMate`);
    await downloadAddon('TentativeGuildMate', addonsDir).then(() => {
      log.info('Installed <Tentative> GuildMate Addon');
    });
  }

  if (!hasGearMateInstalled()) {
    fs.mkdirSync(`${addonsDir}\\TentativeGearMate`);
    await downloadAddon('TentativeGearMate', addonsDir).then(() => {
      log.info('Installed <Tentative> GearMate Addon');
    });
  }
};

module.exports = {
  initializeAddons
};
