const sessionSecter = process.env.SESSION_SECRET;
const session = require("express-session");
const redis = require("connect-redis");

const redisClient = require("redis").createClient({
    legacyMode: true,
});
redisClient.connect().catch(console.log);

const RedisStore = redis(session);

const sess = session({
    store: new RedisStore({ client: redisClient }),
    secret: sessionSecter,
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false, // Only set to true if you are using HTTPS.
        httpOnly: false, // Only set to true if you are using HTTPS.
        maxAge: 60000000,
    },
});

module.exports = sess;
