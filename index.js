const utils = require('./utils/utils.js')
const utils_browser = require('./utils/browser.js')

let exportsParams = {
    ...utils,
}

if (typeof window === 'object') {
    exportsParams = { ...exportsParams, ...utils_browser }
}

module.exports = exportsParams