const fs = require('fs');
const luaparse = require('luaparse');
const log = require('electron-log');
const { isEmpty } = require('ramda');
const { guildUpdated } = require('../api');
const {
  getAddonFields,
  getCharacterName,
  getTextValue,
  getValue
} = require('./parse');

function parseSavedGuildData(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const parsedData = luaparse.parse(data);
    const characterName = getCharacterName(parsedData);
    const memberData = getAddonFields(parsedData, 'members');

    const members = memberData.map(field => {
      if (field.value.fields) {
        return {
          isOnline: getValue(field, 0),
          note: getTextValue(field, 1),
          name: getTextValue(field, 2),
          zone: getTextValue(field, 3),
          officerNote: getTextValue(field, 4),
          level: getValue(field, 5),
          class: getTextValue(field, 6),
          rank: getTextValue(field, 7),
        };
      }

      return {};
    });

    log.info(`Updating guild info for ${characterName}`);

    if (!isEmpty(members)) {
      guildUpdated(characterName, members);
    }
  } catch (err) {
    log.error(err);
  }
}

module.exports = {
  parseSavedGuildData
};
