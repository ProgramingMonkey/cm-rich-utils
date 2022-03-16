const utils = require('./utils/utils.js')
const utils_browser = require('./utils/browser.js')

let exportsParams = {
    ...utils,
}

try {
    if (window) {
        exportsParams = { ...exportsParams, ...utils_browser }
    }
} catch (e) {
    console.log('未处于浏览器环境')
}

module.exports = exportsParams