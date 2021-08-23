const chokidar = require('chokidar');
const log = require('electron-log');
const getSavedVariablesPath = require('./utils/getSavedVariablesPath');
const { parseSavedVariables } = require('./utils/parse');

let watcher = null;

const initializeWatcher = async () => {
  const savedVariablesPath = getSavedVariablesPath();

  if (savedVariablesPath) {
    log.info(`Initializing watcher at ${savedVariablesPath}`);

    parseSavedVariables(savedVariablesPath);

    if (watcher) {
      log.info('Closing Watcher...');
      await watcher.close();
    }

    watcher = chokidar.watch(savedVariablesPath, {
      depth: 0,
      persistent: true,
      usePolling: true,
      ignoreInitial: true,
    });

    watcher.on('change', () => parseSavedVariables());
  } else {
    if (!savedVariablesPath) {
      console.error('Please set game path');
    }
  }
};

module.exports = {
  initializeWatcher
};
