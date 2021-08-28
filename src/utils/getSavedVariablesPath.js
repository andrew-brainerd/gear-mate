const fs = require('fs');
const Store = require('electron-store');
const { WTF_PATH } = require('../constants');

const store = new Store();

const getAccount = async (wtfPath, addonName) => {
  const account = await new Promise(resolve => {
    fs.readdir(wtfPath, (err, wtfContents) => {
      wtfContents.forEach(accountDir => {
        const accountDirPath = `${wtfPath}\\${accountDir}`;
        fs.readdir(accountDirPath, (err, accountContents) => {
          if (accountContents.includes('SavedVariables')) {
            const savedVariablesPath = `${accountDirPath}\\SavedVariables`;
            fs.readdir(savedVariablesPath, (err, addons) => {
              if (addons.includes(`${addonName}.lua`)) {
                resolve(accountDir)
              }
            });
          }
        });
      });
    });
  });

  return account;
};

const getSavedVariablesPath = async addonName => {
  const wtfPath = `${store.get('gamePath')}\\${WTF_PATH}`;
  const account = await getAccount(wtfPath, addonName);

  if (!account) {
    return null;
  }

  return `${wtfPath}\\${account}\\SavedVariables\\${addonName}.lua`;
}

module.exports = {
  getSavedVariablesPath
};
