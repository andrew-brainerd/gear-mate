require('dotenv').config();
const { app, BrowserWindow, screen, Tray, Menu } = require('electron');
const noop = require('./src/utils/noop');
const { autoLaunchApplication } = require('./src/autoLaunch');
const { initializeWatcher } = require('./src/replayWatcher');
const getAppIcon = require('./getAppIcon');

let tray = null;
let mainWindow = null;

const createWindow = () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const windowWidth = 335;
  const windowHeight = 450;
  const taskBarHeight = 40;
  const xPosition = primaryDisplay.bounds.width - windowWidth;
  const yPosition = primaryDisplay.bounds.height - windowHeight - taskBarHeight;

  mainWindow = new BrowserWindow({
    frame: true,
    title: '<Tentative> GuildMate',
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

const showTrayNotification = (message, title = '<Tentative> GuildMate', action) => {
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
      click: () => mainWindow.show()
    },
    {
      label: 'Exit',
      click: () => mainWindow.destroy()
    }
  ]);

  tray.setToolTip('<Tentative> GuildMate');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => mainWindow.show());
  showTrayNotification(
    'Now tracking your saved instances', 
    '<Tentative> GuildMate Running'
  );
};

const preventMultipleInstances = () => {
  const instanceLock = app.requestSingleInstanceLock();

  if (!instanceLock) {
    app.quit();
  } else {
    app.on('second-instance', () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    })
  }
};

app.whenReady().then(() => {
  autoLaunchApplication();
  preventMultipleInstances();
  createTray();
  createWindow();
  initializeWatcher();
});

module.exports = {
  showTrayNotification
};
