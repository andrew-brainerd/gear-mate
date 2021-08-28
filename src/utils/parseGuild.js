const fs = require('fs');
const luaparse = require('luaparse');
const log = require('electron-log');
const { guildUpdated } = require('../api');

function parseSavedGuildInfo(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const parsedData = luaparse.parse(data);

    guildUpdated(parsedData);
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  parseSavedGuildInfo
};
