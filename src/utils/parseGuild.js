const fs = require('fs');
const luaparse = require('luaparse');
const log = require('electron-log');
const { guildUpdated } = require('../api');

function getGuildData(data) {
  return data.body[0].init[0].fields;
}

function getRawValue(field, index) {
  return removeQuotes(field.value.fields[index]?.value?.raw);
}

function getValue(field, index) {
  return (field.value.fields[index].value || {}).value;
}

function parseSavedGuildInfo(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const parsedData = luaparse.parse(data);
    const guildData = getGuildData(parsedData);

    const guild = guildData.map(field => {
      if (field.value.fields.length > 0) {
        return {
          name: removeQuotes(field.key.raw),
          isOnline: getValue(field, 0),
          zone: getRawValue(field, 1),
          level: getValue(field, 2),
          class: getRawValue(field, 3),
          rank: getRawValue(field, 4),
        };
      }

      return {};
    });
;
    guildUpdated(guild);
  } catch (err) {
    console.error(err);
  }
}

function removeQuotes(str) {
  return str && str.replace(/"/g, '');
}

module.exports = {
  parseSavedGuildInfo
};
