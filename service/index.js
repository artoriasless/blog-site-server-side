'use strict';

const user = require('./user');
const message = require('./message');
const paper = require('./paper');
const catalogue = require('./catalogue');
const reply = require('./reply');

const util = require('./util');

module.exports = {
    user,
    message,
    paper,
    catalogue,
    reply,

    util,
};