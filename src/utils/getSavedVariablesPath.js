const Store = require('electron-store');

const store = new Store();

function getSavedVariablesPath() {
  return store.get('gamePath') + '/_classic_/WTF/Account/70241920#3/SavedVariables/GearMate.lua';
}

module.exports = getSavedVariablesPath;
