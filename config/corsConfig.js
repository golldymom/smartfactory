const whitelist = require('./whitelist.json');

const corsConfig = {
  origin: whitelist,
  methods: ['OPTIONS', 'GET', 'POST', 'HEAD', 'PUT', 'DELETE'],
  Credential: true,
};

module.exports = corsConfig;
