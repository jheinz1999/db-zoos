const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = require('./knexfile');

const server = express();
const db = knex(knexConfig.development);

server.use(express.json());
server.use(helmet());

// endpoints here

server.post('/api/zoos', async (req, res) => {

  const { name } = req.body;

  if (!name) {

    res.status(400).json({message: 'INVALID REQUEST: Body requires name property!'});
    return;

  }

  try {

    const id = await db.insert({ name }).into('zoos');
    const newObj = await db.select().from('zoos').where('id', id[0]);

    res.status(201).json(newObj[0]);

  }

  catch (err) {

    res.status(500).json({message: 'DATABASE ERROR: Names must be unique'});

  }

});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
