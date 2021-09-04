const fs = require('fs');
const luaparse = require('luaparse');
const log = require('electron-log');
const { isEmpty } = require('ramda');
const { guildUpdated } = require('../api');

function getCharacterName(data) {
  return removeQuotes(data.body[0].init[0].fields[0].key.raw);
}

function getCharacterData(data) {
  return data.body[0].init[0].fields[0].value.fields;
}

function getGuildData(data) {
  return getCharacterData(data).find(d =>
    removeQuotes(d.key.raw) === 'members'
  ).value.fields;
}

function getRawValue(field, index) {
  return removeQuotes(field.value.fields[index]?.value?.raw);
}

function getValue(field, index) {
  return field?.value?.fields[index]?.value?.value;
}

function parseSavedGuildInfo(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const parsedData = luaparse.parse(data);
    const characterName = getCharacterName(parsedData);
    const guildData = getGuildData(parsedData);

    const guild = guildData.map(field => {
      if (field.value.fields) {
        return {
          isOnline: getValue(field, 0),
          note: getRawValue(field, 1),
          name: getRawValue(field, 2),
          zone: getRawValue(field, 3),
          officerNote: getRawValue(field, 4),
          level: getValue(field, 5),
          class: getRawValue(field, 6),
          rank: getRawValue(field, 7),
        };
      }

      return {};
    });

    log.info(`Updating guild info for ${characterName}`);

    if (!isEmpty(guild)) {
      guildUpdated(characterName, guild);
    }
  } catch (err) {
    log.error(err);
  }
}

function removeQuotes(str) {
  return str && str.replace(/"/g, '');
}

module.exports = {
  parseSavedGuildInfo
};
