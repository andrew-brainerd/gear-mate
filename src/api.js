const axios = require('axios');
const log = require('electron-log');
const { prop } = require('ramda');

const basicJsonHeader = { 'Content-Type': 'application/json' };

const BASE_API_URL = process.env.API_URL || 'https://tentative-server.herokuapp.com/api';

const client = axios.create({
  baseURL: BASE_API_URL,
  headers: basicJsonHeader,
  maxContentLength: Infinity,
  maxBodyLength: Infinity
});

const gearUpdated = async (character, gear) => {
  log.info('Uploading new gear set', { character, gear });
  return await client.post('/gear', { character, gear })
    .then(prop('data'))
    .catch(err => log.error(err));
};

const guildUpdated = async guild => {
  log.info('Uploading new guild roster', { guild });
  return await client.post('/guild', { guild })
    .then(prop('data'))
    .catch(err => log.error(err));
};

module.exports = {
  gearUpdated,
  guildUpdated
};
