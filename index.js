const { ipcRenderer } = require('electron');
const log = require('electron-log');
const { getStore } = require('./src/store');

const store = getStore();

const getById = id => document.getElementById(id);
const getValue = id => getById(id).value;
const setValue = (id, value) => getById(id).value = value;
const setText = (id, text) => getById(id).innerText = text;
const showElement = id => getById(id).style.display = 'block';
const hideElement = id => getById(id).style.display = 'none';

document.addEventListener('DOMContentLoaded', () => {
  const currentGamePath = store.get('gamePath');

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

  log.info('Updated game path to', gamePath);
  store.set('gamePath', gamePath);

  ipcRenderer.invoke('game-path-updated');
};
