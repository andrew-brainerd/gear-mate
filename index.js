const Store = require('electron-store');
const log = require('electron-log');
const { initializeWatcher } = require('./src/watcher');
const { DEFAULT_GAME_PATH } = require('./src/constants');

const store = new Store();

const getById = id => document.getElementById(id);
const getValue = id => getById(id).value;
const setValue = (id, value) => getById(id).value = value;
const setText = (id, text) => getById(id).innerText = text;
const showElement = id => getById(id).style.display = 'block';
const hideElement = id => getById(id).style.display = 'none';

document.addEventListener('DOMContentLoaded', () => {
  const currentGamePath = store.get('gamePath') || DEFAULT_GAME_PATH;

  setValue('gamePath', currentGamePath);
  setText('currentGamePath', currentGamePath);
});

const editGamePath = () => {
  hideElement('gamePathDisplay');
  showElement('gamePathInput');
};

const updateGamePath = () => {
  const gamePath = getValue('gamePath');

  setText('currentGamePath', gamePath);
  hideElement('gamePathInput');
  showElement('gamePathDisplay');

  log.info('Updating game path to', gamePath);
  store.set('gamePath', gamePath);

  initializeWatcher();
};
