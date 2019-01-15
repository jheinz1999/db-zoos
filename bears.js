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

    const id = await db.insert({ name }).into('bears');
    const newObj = await db.select().from('bears').where('id', id[0]);

    res.status(201).json(newObj[0]);

  }

  catch (err) {

    res.status(400).json({message: 'DATABASE ERROR: Names must be unique'});

  }

});

server.get('/', async (req, res) => {

  try {

    const bears = await db.select().from('bears');

    res.status(200).json(bears);

  }

  catch (err) {

    res.status(500).json({message: 'INTERNAL SERVER ERROR'});

  }

});

server.get('/:id', async (req, res) => {

  try {

    const bear = await db.select().from('bears').where('id', req.params.id);

    if (bear.length) {

      res.status(200).json(bear[0]);
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

    const bear = await db.select().from('bears').where('id', req.params.id);

    if (!bear.length) {

      res.status(404).json({message: '404 NOT FOUND'});
      return;

    }

    await db.delete().from('bears').where('id', req.params.id);

    res.status(200).json(bear);

  }

  catch (err) {

    res.status(500).json({message: 'INTERNAL SERVER ERROR'});

  }

});

server.put('/:id', async (req, res) => {

  try {

    let bear = await db.select().from('bears').where('id', req.params.id);

    if (!bear.length) {

      res.status(404).json({message: '404 NOT FOUND'});
      return;

    }

    const { name } = req.body;

    if (!name) {

      res.status(400).json({message: 'INVALID REQUEST: Body requires name property!'});
      return;

    }

    try {

      const id = await db.update('name', name).from('bears').where('id', req.params.id);
      bear = await db.select().from('bears').where('id', req.params.id);

    }

    catch (err) {

      res.status(400).json({message: 'DATABASE ERROR: Names must be unique!', error: err});
      return;

    }

    res.status(200).json(bear);

  }

  catch (err) {

    res.status(500).json({message: 'INTERNAL SERVER ERROR'});

  }

});

module.exports = server;
