const fs = require('fs');
const log = require('electron-log');
const { getStore } = require('../store');
const { ADDONS_PATH, WTF_PATH } = require('../constants');

const store = getStore();

const getAccount = async (wtfPath, addonName) => {
  let account = null;

  log.info('Getting account directory');

  await new Promise((resolve, reject) => {
    fs.readdir(wtfPath, (err, wtfContents) => {
      if (err) {
        log.error('Failed to read WTF directory path', err);
        return reject(err);
      }
      wtfContents.forEach(accountDir => {
        const accountDirPath = `${wtfPath}\\${accountDir}`;
        fs.readdir(accountDirPath, (err, accountContents) => {
          if (err) {
            log.error('Failed to read Account directory path', err);
            return reject(err);
          }
          if (accountContents.includes('SavedVariables')) {
            const savedVariablesPath = `${accountDirPath}\\SavedVariables`;
            fs.readdir(savedVariablesPath, (err, addons) => {
              if (err) {
                log.error('Failed to read SavedVariables path', err);
                return reject(err);
              }
              if (addons.includes(`${addonName}.lua`)) {

                resolve(accountDir);
              }
            });
          }
        });
      });
    });
  }).then(accountDir => { account = accountDir; })
  .catch(err => {
    log.error(err);
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
  const accountPath = await getAccount(wtfPath, addonName);

  if (!accountPath) {
    log.error(`Unable to locate account directory`);
    return null;
  }

  const savedVariablesPath = `${wtfPath}\\${accountPath}\\SavedVariables\\${addonName}.lua`;

  log.info(`SavedVariables for ${addonName} located at ${savedVariablesPath}`);

  return savedVariablesPath;
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
