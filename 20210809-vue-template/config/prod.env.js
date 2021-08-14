'use strict'
const config = require('../config')
const ASSETS_PUBLIC_PATH = config.build.assetsPublicPath;
module.exports = {
    NODE_ENV: '"production"',
    ASSETS_PUBLIC_PATH: `"${ASSETS_PUBLIC_PATH}"`
}
