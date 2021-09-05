const fs = require('fs');
const luaparse = require('luaparse');
const log = require('electron-log');
const { isEmpty } = require('ramda');
const { gearUpdated } = require('../api');
const {
  getAddonFields,
  getAddonValue,
  getCharacterName,
  getTextValue,
  getValue
} = require('./parse');

function parseSavedGearData(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const parsedData = luaparse.parse(data);
    const characterName = getCharacterName(parsedData);
    const characterClass = getAddonValue(parsedData, 'characterClass');
    const gearData = getAddonFields(parsedData, 'gear');
    const character = { characterName, characterClass };

    const gear = gearData.map(field => {
      if (field.value.fields) {
        return {
          itemId: getValue(field, 3),
          itemSlot: getValue(field, 1),
          itemName: getTextValue(field, 2),
          itemRarity: getValue(field, 0)
        };
      }

      return {};
    }).filter(item => item.itemId);

    log.info(`Updating gear for ${characterName}`);

    if (!isEmpty(gear)) {
      gearUpdated(character, gear);
    }
  } catch (err) {
    log.error(err);
  }
}

function removeQuotes(str) {
  return str && str.replace(/"/g, '');
}

module.exports = {
  parseSavedGearData
};
