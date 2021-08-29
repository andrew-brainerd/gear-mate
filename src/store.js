const Store = require('electron-store');
const { DEFAULT_GAME_PATH } = require('./constants');

const store = new Store();

const initializeStore = () => {
  if (!store.get('gamePath')) {
    store.set('gamePath', DEFAULT_GAME_PATH);
  }

  store.delete('error');
};

module.exports = {
  initializeStore
};
