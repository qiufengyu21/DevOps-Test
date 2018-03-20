/**
 * NodeJS Test Generation Module
 */

// Local Modules
const generateTestCases = require('./testutils/testgenerator');


// Polyfills
require('./testutils/format-polyfill');

/**
 * Parse an input file and generate test cases for it.
 */
(module.exports.main = function() {

    let filePaths = ['routes/create.js', 'routes/admin.js', 'routes/study.js'];

    // Generate test cases
    generateTestCases(filePaths);

})();