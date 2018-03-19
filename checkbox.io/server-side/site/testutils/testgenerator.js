// Core/NPM Modules
const product = require('iter-tools/lib/product');
const _ = require('lodash');
const fs = require('fs');


/**
 * Generate test cases based on the global object functionConstraints.
 *
 * @param {String} filepath            Path to write test file.
 * @param {Object} functionConstraints Constraints object as returned by `constraints`.
 */
function generateTestCases(filepath, functionConstraints) {

    var initialStatements = `let sinon = require('sinon');\nvar mongo = require('mongodb');\nvar MongoClient = mongo.MongoClient;\n\n`;
    initialStatements += `let returnValue = {\n\tconnect: 'abc'\n}\n\n`;
    initialStatements += `var stubbedMongoClient = sinon.stub(MongoClient, "connect").returns(returnValue.connect);\n`;
    // Content string. This will be built up to generate the full text of the test string.
    let content = initialStatements + `let create = require('${filepath}');\n\n`;

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

            content += `try { ${"create.{0}({1});".format(funcName, args)} } catch (e) {} \n\n`;

        }

    }

    // Write final content string to file test.js.
    fs.writeFileSync('test.js', content, "utf8");

}

// Export
module.exports = generateTestCases;