const knex = require('knex');
const knexConfig = require('../knexfile');
const paginator = require('knex-paginator');

paginator(knex);
const db = knex(knexConfig.development);

module.exports = db;
