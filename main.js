require('dotenv').config();
const { app, BrowserWindow, screen, Tray, Menu, ipcMain } = require('electron');
const { handleErrors } = require('./src/utils/errors');
const { checkForUpdates } = require('./src/utils/update');
const { autoLaunchApplication } = require('./src/autoLaunch');
const { initializeStore, getStore } = require('./src/store');
const { initializeAddons } = require('./src/addons');
const { initializeWatcher } = require('./src/watcher');
const { showNotification } = require('./src/utils/notifications');
const { APP_NAME } = require('./src/constants');
const getAppIcon = require('./getAppIcon');
const log = require('electron-log');

let tray = null;
let mainWindow = null;

const store = getStore();
const appName = `${APP_NAME} v${app.getVersion()}`;

app.setAppUserModelId(appName);

log.info(appName);

const createWindow = () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const windowWidth = 335;
  const windowHeight = 450;
  const taskBarHeight = 40;
  const xPosition = primaryDisplay.bounds.width - windowWidth;
  const yPosition = primaryDisplay.bounds.height - windowHeight - taskBarHeight;

  mainWindow = new BrowserWindow({
    frame: true,
    title: appName,
    width: windowWidth,
    height: windowHeight,
    x: xPosition,
    y: yPosition,
    show: false,
    resizable: false,
    autoHideMenuBar: true,
    darkTheme: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  // mainWindow.webContents.openDevTools();

  mainWindow.on('minimize', event => {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('close', event => {
    if (!store.get('autoUpdating')) {
      store.delete('autoUpdating', false);
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.loadFile('index.html');
};

const createTray = () => {
  tray = new Tray(getAppIcon());
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      click: () => showApplication()
    },
    {
      label: 'Reset',
      click: () => {
        store.clear();
        app.relaunch();
      }
    },
    {
      label: 'Exit',
      click: () => closeApplication()
    }
  ]);

  tray.setToolTip(appName);
  tray.setContextMenu(contextMenu);
  tray.on('click', showApplication);
};

const preventMultipleInstances = () => {
  const instanceLock = app.requestSingleInstanceLock();

  if (!instanceLock) {
    app.quit();
  } else {
    app.on('second-instance', () => {
      if (mainWindow) {
        showApplication();
      }
    })
  }
};

const showApplication = () => {
  mainWindow.show();
  mainWindow.focus();
};

const closeApplication = () => {
  mainWindow.destroy();
};

const initializeApp = () => {
  initializeStore();
  initializeAddons().then(err => {
    if (err) {
      log.info(err.message);
    } else {
      initializeWatcher();
      showNotification('Syncing guild data', `${appName} Running`);
    }
  });
};

ipcMain.handle('game-path-updated', () => {
  initializeApp();
});

app.on('ready', () => {
  autoLaunchApplication(appName);
  preventMultipleInstances();
  createTray();
  createWindow();
  handleErrors();
  checkForUpdates();
  initializeApp();
});

// app.on('window-all-closed', () => {
//   app.quit();
// });

module.exports = {
  showApplication,
  closeApplication,
  initializeApp
};
