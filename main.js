require('dotenv').config();
const { app, BrowserWindow, screen, Tray, Menu } = require('electron');
const Store = require('electron-store');
const noop = require('./src/utils/noop');
const { handleErrors}  = require('./src/utils/errors');
const { autoLaunchApplication } = require('./src/autoLaunch');
const { initializeStore } = require('./src/store');
const { initializeAddons } = require('./src/addons');
const { initializeWatcher } = require('./src/watcher');
const { APP_NAME } = require('./src/constants');
const getAppIcon = require('./getAppIcon');

let tray = null;
let mainWindow = null;

const store = new Store();

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

const showTrayNotification = (message, title = APP_NAME, action = showApplication) => {
  tray.displayBalloon({
    title,
    icon: getAppIcon(),
    content: message,
    respectQuietTime: true
  });

  tray.removeAllListeners(['balloon-click']);

  tray.once('balloon-click', e => {
    e.preventDefault();
    action ? action() : noop();
  });
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
        app.quit();
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

app.whenReady().then(() => {
  autoLaunchApplication();
  preventMultipleInstances();
  createTray();
  createWindow();
  handleErrors();
  initializeStore();
  initializeAddons().then(() => {
    initializeWatcher();
  });

  showTrayNotification(
    'Now syncing guild info', 
    `${APP_NAME} Running`,
    showApplication
  );
});

module.exports = {
  showTrayNotification,
  showApplication,
  closeApplication
};
