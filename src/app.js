const Logger = require('./libs/logger')

const bannerLogger = require('./libs/banner')

const expressLoader = require('./loaders/expressLoader')
const mongooseLoader = require('./loaders/mongooseLoader')
const monitorLoader = require('./loaders/monitorLoader')
const passportLoader = require('./loaders/passportLoader')
const publicLoader = require('./loaders/publicLoader')
const swaggerLoader = require('./loaders/swaggerLoader')
const winstonLoader = require('./loaders/winstonLoader')
const ejs = require('ejs');
const path = require('path');
/**
 * NODEJS API BOILERPLATE
 * ----------------------------------------
 *
 * This is a boilerplate for Node.js Application written in Vanilla Javascript.
 * The basic layer of this app is express. For further information visit
 * the 'README.md' file.
 */
const log = new Logger(__filename)

// Init loaders
async function initApp() {
    // logging
    winstonLoader()

    // Database
    await mongooseLoader()

    // express
    const app = expressLoader()

    // monitor
    monitorLoader(app)

    // swagger
    swaggerLoader(app)

    // passport init
    passportLoader(app)

    // public Url
    publicLoader(app)
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs')
}

initApp()
    .then(() => bannerLogger(log))
    .catch((error) => log.error('Application is crashed: ' + error))
