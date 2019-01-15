const express = require('express');
const db = require('./data/db');

const server = express.Router();

server.post('/', async (req, res) => {

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

server.get('/', async (req, res) => {

  const perPage = req.query.pageLength || 10;
  const page = req.query.page || 1;

  try {

    const zoos = await db.select().from('zoos').paginate(perPage, page);

    res.status(200).json(zoos);

  }

  catch (err) {

    res.status(500).json({message: 'INTERNAL SERVER ERROR'});

  }

});

server.get('/:id', async (req, res) => {

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

server.delete('/:id', async (req, res) => {

  try {

    const zoo = await db.select().from('zoos').where('id', req.params.id);

    if (!zoo.length) {

      res.status(404).json({message: '404 NOT FOUND'});
      return;

    }

    await db.delete().from('zoos').where('id', req.params.id);

    res.status(200).json(zoo);

  }

  catch (err) {

    res.status(500).json({message: 'INTERNAL SERVER ERROR'});

  }

});

server.put('/:id', async (req, res) => {

  try {

    let zoo = await db.select().from('zoos').where('id', req.params.id);

    if (!zoo.length) {

      res.status(404).json({message: '404 NOT FOUND'});
      return;

    }

    const { name } = req.body;

    if (!name) {

      res.status(400).json({message: 'INVALID REQUEST: Body requires name property!'});
      return;

    }

    try {

      const id = await db.update('name', name).from('zoos').where('id', req.params.id);
      zoo = await db.select().from('zoos').where('id', req.params.id);

    }

    catch (err) {

      res.status(400).json({message: 'DATABASE ERROR: Names must be unique!', error: err});
      return;

    }

    res.status(200).json(zoo);

  }

  catch (err) {

    res.status(500).json({message: 'INTERNAL SERVER ERROR'});

  }

});

module.exports = server;
