function getAddonFields(data, field) {
  return getCharacterData(data).find(d =>
    removeQuotes(d.key.raw) === field
  ).value.fields;
}

function getAddonValue(data, property) {
  const value = getCharacterData(data).find(d =>
    removeQuotes(d.key.raw) === property
  ).value.raw;

  return value ? removeQuotes(value) : '';
}

function getCharacterData(data) {
  return data.body[0].init[0].fields[0].value.fields;
}

function getCharacterName(data) {
  return removeQuotes(data.body[0].init[0].fields[0].key.raw);
}

function getTextValue(field, index) {
  return removeQuotes(field.value.fields[index]?.value?.raw);
}

function getValue(field, index) {
  return field?.value?.fields[index]?.value?.value;
}

function removeQuotes(str) {
  return str && str.replace(/"/g, '');
}

module.exports = {
  getAddonFields,
  getAddonValue,
  getCharacterName,
  getTextValue,
  getValue,
  removeQuotes
};
