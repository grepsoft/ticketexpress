const express = require('express');
const seatingRoute = require('./seatingRoute');

module.exports = (config) => {

    const router = express.Router();    

    router.get('/', (req, res) => {
        res.send("Ticket express");
    });

    router.use('/seating', seatingRoute(config));

    return router;
}