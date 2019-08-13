'use strict';

module.exports = {
    domain: 'https://www.stanby.cn',
    port: 80,
    db: {
        host: 'test',
        port: 3306,
        user: 'test',
        password: 'test',
        database: 'test',
        seq_options: {
            logging: false,
            dialectOptions: {
                charset: 'utf8',
            },
        },
    },
    owners: []
};
