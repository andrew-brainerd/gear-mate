const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const { getStore } = require('../store');
const { showNotification } = require('./notifications');

const store = getStore();

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

autoUpdater.on('checking-for-update', () => {
  log.info('Checking for application update...');
});

autoUpdater.on('update-available', info => {
  log.info('Application update available');
});

autoUpdater.on('update-not-available', info => {
  log.info('Application update not available');
});

autoUpdater.on('error', err => {
  log.info('Error in auto-updater ' + err);
});

autoUpdater.on('download-progress', progress => {
  let logMessage = 'Download speed: ' + progress.bytesPerSecond;
  logMessage = logMessage + ' - Downloaded ' + Math.round(progress.percent) + '%';
  logMessage = logMessage + ' (' + progress.transferred + '/' + progress.total + ')';
  log.info(logMessage);
});

autoUpdater.on('update-downloaded', info => {
  log.info('Application update downloaded');
  showNotification('Restarting to install update', 'Updating...');
  setTimeout(() => {
    log.info('Installing new application version...');
    store.set('autoUpdating', true);
    autoUpdater.quitAndInstall();
  }, 5000);
});

const checkForUpdates = () => {
  autoUpdater.checkForUpdates();
};

module.exports = {
  checkForUpdates
};
