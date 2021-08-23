const Store = require('electron-store');
const log = require('electron-log');
const { initializeWatcher } = require('./src/replayWatcher');
const { initializeUserDrop } = require('./src/userDrop');
const { DEFAULT_GAME_PATH } = require('./src/constants');

const store = new Store();

document.addEventListener('DOMContentLoaded', () => {
  const currentGamePath = store.get('gamePath') || DEFAULT_GAME_PATH;
  document.getElementById('gamePath').value = currentGamePath;
  document.getElementById('currentGamePath').innerText = `Game Path: ${currentGamePath}`;

  const username = document.getElementById('username');
  username.innerText = store.get('username') ? `Name: ${store.get('username')}` : '';

  const connectCode = document.getElementById('connectCode');
  connectCode.innerText = store.get('connectCode') ? `Netplay ID: ${store.get('connectCode')}` : '';

  initializeUserDrop();
});

const editGamePath = () => {
  document.getElementById('gamePathDisplay').style.display = 'none';
  document.getElementById('gamePathInput').style.display = 'block';
};

const updateGamePath = () => {
  const gamePath = document.getElementById('gamePath').value;
  document.getElementById('currentGamePath').innerText = `Replay Path: ${gamePath}`;
  document.getElementById('gamePathDisplay').style.display = 'block';
  document.getElementById('gamePathInput').style.display = 'none';

  log.info('Updating game path to', gamePath);
  store.set('gamePath', gamePath);
  initializeWatcher();
};
