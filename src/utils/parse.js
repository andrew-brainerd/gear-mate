require('dotenv').config();
const fs = require('fs');
const luaparse = require('luaparse');
const { gearUpdated } = require('../api');

function getCharacterName(data) {
  return removeQuotes(data.body[0].init[0].fields[0].key.raw);
}

function getGearData(data) {
  return data.body[0].init[0].fields[0].value.fields;
}

function getItemText(item) {
  return `${item.itemSlot}: ${item.itemName} (${item.itemRarity}) [${getWowheadUrl(item.itemId)}]\n`;
}

function getRawValue(field, index) {
  return removeQuotes(field.value.fields[index].value.raw);
}

function getValue(field, index) {
  return field.value.fields[index].value.value;
}

const getWowheadUrl = itemId => `https://www.wowhead.com/item=${itemId}`;

function parseSavedVariables() {
  try {
    const data = fs.readFileSync(process.env.FILE_PATH, 'utf8');
    const parsedData = luaparse.parse(data);
    const characterName = getCharacterName(parsedData);
    const gearData = getGearData(parsedData);

    const gear = gearData.map(field => {
      if (field.value.fields) {
        return {
          itemId: getValue(field, 3),
          itemSlot: getValue(field, 1),
          itemName: getRawValue(field, 2),
          itemRarity: getValue(field, 0)
        };
      }

      return {};
    }).filter(item => item.itemId);

    // writeGearToFile(gear);
    gearUpdated(characterName, gear);
  } catch (err) {
    console.error(err);
  }
}

function removeQuotes(str) {
  return str.replace(/"/g, '');
}

function writeGearToFile(gear) {
  const filePath = 'H:\\MyCurrentGear';

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  gear.forEach(item => {
    fs.appendFileSync(filePath, getItemText(item), err => {
      if (err) {
        console.error(err);
        return;
      }
    });
  });
}

module.exports = {
  parseSavedVariables
};
