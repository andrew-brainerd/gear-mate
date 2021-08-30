require('dotenv').config();
const { app, BrowserWindow, screen, Tray, Menu, ipcMain } = require('electron');
const log = require('electron-log');
const { handleErrors}  = require('./src/utils/errors');
const { autoLaunchApplication } = require('./src/autoLaunch');
const { initializeStore, getStore } = require('./src/store');
const { initializeAddons } = require('./src/addons');
const { initializeWatcher } = require('./src/watcher');
const { showNotification } = require('./src/utils/notifications');
const { APP_NAME } = require('./src/constants');
const getAppIcon = require('./getAppIcon');

let tray = null;
let mainWindow = null;

const store = getStore();

app.setAppUserModelId(APP_NAME);

const createWindow = () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const windowWidth = 335;
  const windowHeight = 450;
  const taskBarHeight = 40;
  const xPosition = primaryDisplay.bounds.width - windowWidth;
  const yPosition = primaryDisplay.bounds.height - windowHeight - taskBarHeight;

  mainWindow = new BrowserWindow({
    frame: true,
    title: APP_NAME,
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

  mainWindow.on('minimize', event => {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('close', event => {
    event.preventDefault();
    mainWindow.hide();
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

  tray.setToolTip(APP_NAME);
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
      showNotification(err.message, 'Error');
    } else {
      initializeWatcher();
      showNotification('Now syncing guild data', `${APP_NAME} Running`);
    }
  });
};

ipcMain.handle('game-path-updated', () => {
  initializeApp();
});

app.whenReady().then(() => {
  autoLaunchApplication();
  preventMultipleInstances();
  createTray();
  createWindow();
  handleErrors();
  initializeApp();
});

module.exports = {
  showApplication,
  closeApplication,
  initializeApp
};
