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

    res.status(400).json({message: 'DATABASE ERROR: Names must be unique'});

  }

});

server.get('/api/zoos', async (req, res) => {

  try {

    const zoos = await db.select().from('zoos');

    res.status(200).json(zoos);

  }

  catch (err) {

    res.status(500).json({message: 'INTERNAL SERVER ERROR'});

  }

});

server.get('/api/zoos/:id', async (req, res) => {

  try {

    const zoo = await db.select().from('zoos').where('id', req.params.id);

    if (zoo.length) {

      res.status(200).json(zoo[0]);
      return;

    }

    res.status(404).json({message: '404 NOT FOUND'});

  }

  catch (err) {

    res.status(500).json({message: 'INTERNAL SERVER ERROR'});

  }

});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
