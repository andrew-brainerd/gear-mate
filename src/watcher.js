const chokidar = require('chokidar');
const log = require('electron-log');
const { getSavedVariablesPath } = require('./utils/paths');
const { parseSavedGuildData } = require('./utils/parseGuild');
const { parseSavedGearData } = require('./utils/parseGear');
const { parseSavedSpellbookData } = require('./utils/parseSpellbook');
const { parseSavedCraftData } = require('./utils/parseCrafting');
const { GUILD_MATE, GEAR_MATE, SPELL_MATE, CRAFT_MATE } = require('./constants');

let watcher = null;

const getAddonName = path => {
  const directories = path.split('\\');
  const fileName = directories[directories.length - 1];

  return fileName.split('.')[0];
}

const initializeWatcher = async () => {
  const guildMatePath = await getSavedVariablesPath(GUILD_MATE);
  const gearMatePath = await getSavedVariablesPath(GEAR_MATE);
  const spellMatePath = await getSavedVariablesPath(SPELL_MATE);
  const craftMatePath = await getSavedVariablesPath(CRAFT_MATE);
  const savedVariablesPaths = [gearMatePath, guildMatePath, spellMatePath, craftMatePath];

  if (watcher) {
    log.info('Closing Watcher');
    await watcher.close();
  }

  if (guildMatePath && gearMatePath && spellMatePath && craftMatePath) {
    savedVariablesPaths.forEach(path => {
      log.info(`Initializing watcher at ${path}`);
    });

    watcher = chokidar.watch(savedVariablesPaths, {
      depth: 0,
      persistent: true,
      usePolling: true,
      ignoreInitial: true,
    });

    watcher.on('change', path => {
      log.info('Addon DB Updated', path);

      const addonName = getAddonName(path);

      if (addonName === GUILD_MATE) {
        parseSavedGuildData(path);
      } else if (addonName === GEAR_MATE) {
        parseSavedGearData(path);
      } else if (addonName === SPELL_MATE) {
        // parseSavedSpellbookData(path);
      } else if (addonName === CRAFT_MATE) {
        // parseSavedCraftData(path);
      } else {
        log.error('Unhandled file change: ', path);
      }
    });
  }
};

module.exports = {
  initializeWatcher
};
