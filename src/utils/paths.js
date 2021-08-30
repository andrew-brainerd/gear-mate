const fs = require('fs');
const log = require('electron-log');
const { getStore } = require('../store');
const { ADDONS_PATH, WTF_PATH } = require('../constants');

const store = getStore();

const getAccount = async (wtfPath, addonName) => {
  let account = null;

  await new Promise((resolve, reject) => {
    fs.readdir(wtfPath, (err, wtfContents) => {
      if (err) { return reject(err); }
      wtfContents.forEach(accountDir => {
        const accountDirPath = `${wtfPath}\\${accountDir}`;
        fs.readdir(accountDirPath, (err, accountContents) => {
          if (err) { return reject(err); }
          if (accountContents.includes('SavedVariables')) {
            const savedVariablesPath = `${accountDirPath}\\SavedVariables`;
            fs.readdir(savedVariablesPath, (err, addons) => {
              if (err) { return reject(err); }
              if (addons.includes(`${addonName}.lua`)) {
                resolve(accountDir)
              }
            });
          }
        });
      });
    });
  }).then(accountDir => { account = accountDir; })
  .catch(err => {
    console.error(err);
    if (err.code === 'ENOENT') {
      store.set('error', 'Invalid WoW Game Path');
    }
  });

  return account;
};

const getAddonPath = (addonName) => {
  return `${getAddonsPath()}\\${addonName}`;
};

const getAddonsPath = () => {
  return `${store.get('gamePath')}\\${ADDONS_PATH}`;
};

const getSavedVariablesPath = async addonName => {
  const wtfPath = `${store.get('gamePath')}\\${WTF_PATH}`;
  const account = await getAccount(wtfPath, addonName);

  if (!account) {
    return null;
  }

  return `${wtfPath}\\${account}\\SavedVariables\\${addonName}.lua`;
};

const hasValidGamePath = () => {
  return fs.existsSync(store.get('gamePath'));
};

module.exports = {
  getAddonPath,
  getAddonsPath,
  getSavedVariablesPath,
  hasValidGamePath
};
