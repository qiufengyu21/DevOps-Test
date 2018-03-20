// Core/NPM Modules
const product = require('iter-tools/lib/product');
const _ = require('lodash');
const fs = require('fs');
const constraints = require('./constraint');
const path    = require('path');


/**
 * Generate test cases based on the global object functionConstraints.
 *
 * @param {Array} filepaths           Path to write test file.
 */
function generateTestCases(filepaths) {


    let testFile = 'test.js';

    if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
    }

    let initialStatements = `let sinon = require('sinon');\nvar mongo = require('mongodb');\nvar MongoClient = mongo.MongoClient;\n\n`;
    initialStatements += `let returnValue = {\n\tconnect: 'abc'\n}\n\n`;
    initialStatements += `var stubbedMongoClient = sinon.stub(MongoClient, "connect").returns(returnValue.connect);\n\n`;

    let content = initialStatements;

    filepaths.forEach((filepath) => {

        filepath = path.resolve(filepath);
        console.log('filepath: ' + filepath);

        filepath = filepath.replace(/\\/g, '/');
        console.log('filepath after replace: ' + filepath);


        // Initialize constraints based on input file
        let functionConstraints = constraints(filepath);

        // Content string. This will be built up to generate the full text of the test string.
        let fileNameWithoutJs = filepath.substring(filepath.lastIndexOf('/') + 1).replace('.js', '');
        content += `let ${fileNameWithoutJs} = require('${filepath}');\n\n`;

        // Iterate over each function in functionConstraints
        for (let funcName in functionConstraints) {
            // Reference all constraints for funcName.
            let params = functionConstraints[funcName].params;

            // Get constraints and map to values
            let constraints = functionConstraints[funcName].constraints;
            let values = _.mapValues(constraints, (arr) => _.map(arr, c => c.value));

            // Generate possible combinations of arguments
            let argCombinations = product(..._.map(params, p => !_.isEmpty(values[p]) ? values[p] : ["''"]));

            // Generate function argument strings from parameter objects.
            for (let combination of argCombinations) {

                // Get final argument string
                let args = combination.join(', ');

                content += `try { ${"{0}.{1}({2});".format(fileNameWithoutJs, funcName, args)} } catch (e) {} \n\n`;

            }

        }
    });

    // Write final content string to file test.js.
    fs.appendFileSync(testFile, content, "utf8");

}

// Export
module.exports = generateTestCases;