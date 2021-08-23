const axios = require('axios');
const { prop } = require('ramda');

const basicJsonHeader = { 'Content-Type': 'application/json' };

const BASE_API_URL = process.env.API_URL || 'https://gear-mate-server.herokuapp.com/api';

const client = axios.create({
  baseURL: BASE_API_URL,
  headers: basicJsonHeader,
  maxContentLength: Infinity,
  maxBodyLength: Infinity
});

const gearUpdated = async (name, gear) => {
  return await client.post('/gear', { name, gear })
    .then(prop('data'))
    .catch(err => console.error(err));
};

module.exports = {
  gearUpdated
};
