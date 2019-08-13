'use strict';

module.exports = {
    domain: 'http://www.stanby.cn',
    port: 3001,
    db: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '12345',
        database: 'blog_local',
        seq_options: {
            logging: false,
            dialectOptions: {
                charset: 'utf8',
            },
        },
    },
    owners: [
        '36c30019-f85f-422e-b37b-efaebb87de3b'
    ],
};
