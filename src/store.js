const Store = require('electron-store');
const log = require('electron-log');
const { DEFAULT_GAME_PATH } = require('./constants');

const store = new Store();

const getStore = () => store;

const initializeStore = () => {
  if (!store.get('gamePath')) {
    store.set('gamePath', DEFAULT_GAME_PATH);
  }

  store.delete('error');
};

module.exports = {
  getStore,
  initializeStore
};
