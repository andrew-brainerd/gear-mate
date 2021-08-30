const chokidar = require('chokidar');
const log = require('electron-log');
const { getSavedVariablesPath } = require('./utils/paths');
const { parseSavedGuildInfo } = require('./utils/parseGuild');
const { parseSavedGear } = require('./utils/parseGear');

let watcher = null;

const getAddonName = path => {
  const directories = path.split('\\');
  const fileName = directories[directories.length - 1];

  return fileName.split('.')[0];
}

const initializeWatcher = async () => {
  const gearMatePath = await getSavedVariablesPath('TentativeGearMate');
  const guildMatePath = await getSavedVariablesPath('TentativeGuildMate');
  const savedVariablesPaths = [gearMatePath, guildMatePath];

  if (watcher) {
    log.info('Closing Watcher...');
    await watcher.close();
    watcher = null;
  }

  if (gearMatePath && guildMatePath) {
    savedVariablesPaths.forEach(path => {
      log.info(`Initializing watcher at ${path}`);
    });

    watcher = chokidar.watch(savedVariablesPaths, {
      depth: 0,
      persistent: true,
      usePolling: true,
      ignoreInitial: true,
    });

    watcher.on('change', path => {
      log.info('File Updated:', path);

      const addonName = getAddonName(path);

      if (addonName === 'TentativeGuildMate') {
        parseSavedGuildInfo(path);
      } else if (addonName === 'TentativeGearMate') {
        parseSavedGear(path);
      } else {
        log.error('Unhandled file change: ', path);
      }
    });
  } else {
    require('../main').showTrayNotification(
      'Invalid WoW game path provided',
      'Error'
    );
  }
};

module.exports = {
  initializeWatcher
};
