const  Pool  = require("pg");
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const pgPool = new Pool.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sessions',
    password: '1234',
    port: 5432,
});

const ExpressSession = session({
    store: new pgSession({
        pool : pgPool,
        tableName : 'session'
    }),
    secret: 'session_cookie_secret',
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
    saveUninitialized: true
})

module.exports = ExpressSession;