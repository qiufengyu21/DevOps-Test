// Core/NPM Modules
const esprima = require("esprima");
const fs = require('fs');
const Random = require('random-js');
const _ = require('lodash');

// Create random generator engine
const engine = Random.engines.mt19937().autoSeed();

const options = { tokens: true, tolerant: true, loc: true, range: true };

/**
 * Constraint class. Represents constraints on function call parameters.
 *
 * @property {String}                                                          ident      Identity of the parameter mapped to the constraint.
 * @property {String}                                                          expression Full expression string for a constraint.
 * @property {String}                                                          operator   Operator used in constraint.
 * @property {String|Number}                                                   value      Main constraint value.
 * @property {String|Number}                                                   altvalue   Constraint alternative value.
 * @property {String}                                                          funcName   Name of the function being constrained.
 */
class Constraint {
    constructor(properties) {
        this.ident = properties.ident;
        this.expression = properties.expression;
        this.operator = properties.operator;
        this.value = properties.value;
        this.altvalue = properties.altvalue;
        this.funcName = properties.funcName;
    }
}


/**
 * Generate function parameter constraints for an input file
 * and save them to the global functionConstraints object.
 *
 * @param   {String} filePath Path of the file to generate tests for.
 * @returns {Object}          Function constraints object.
 */
function constraints(filePath) {

    // Initialize function constraints directory
    let functionConstraints = {};

    // Read input file and parse it with esprima.
    let buf = fs.readFileSync(filePath, "utf8");
    let result = esprima.parse(buf, options);

    // Start traversing the root node
    traverse(result, function (node) {
        // if (node.type) {
        //     console.log(JSON.stringify(node.type));
        // }

        if (node.type === 'ExpressionStatement' && node.expression.left && node.expression.left.object && node.expression.left.object.name === 'exports') {
            let funcName = node.expression.left.property.name;

            // Get function name and arguments
            let params = node.expression.right.params.map(function (p) { return p.name });
            //console.log('params: ' + params);

            //Initialize function constraints
            functionConstraints[funcName] = {
                constraints: _.zipObject(params, _.map(params, () => [])),
                params: params

            };

            // Traverse function node.
            traverse(node.expression.right, function (child) {
                // Handle equivalence expression
                if (_.get(child, 'type') === 'BinaryExpression' && _.includes(['!=', '!==', '==', '===', '<', '>', '<=', '>='], _.get(child, 'operator'))) {
                    if (_.get(child, 'left.type') === 'Identifier') {

                        // Get identifier
                        let ident = child.left.name;
                        //console.log('ident: ' + ident);

                        // Get expression from original source code:
                        let expression = buf.substring(child.range[0], child.range[1]);
                        //console.log('exp: ' + expression);

                        let rightHand = buf.substring(child.right.range[0], child.right.range[1]);
                        //console.log('right: ' + rightHand);
                        // Test to see if right hand is a string
                        let match = rightHand.match(/^['"](.*)['"]$/);

                        if (ident === 'invitecode') {
                            var bodyObj = {};
                            bodyObj['invitecode'] = rightHand.replace(/"/g, '');
                            var req = {};
                            req['body'] = bodyObj;
                            functionConstraints[funcName].constraints[params[0]].push(new Constraint({
                                ident: child.left.name,
                                value: JSON.stringify(req),
                                funcName: funcName,
                                kind: "String",
                                expression: expression
                            }));
                            bodyObj['invitecode'] = rightHand.replace(/"/g, '') + rightHand.replace(/"/g, '');
                            req['body'] = bodyObj;
                            functionConstraints[funcName].constraints[params[0]].push(new Constraint({
                                ident: child.left.name,
                                value: JSON.stringify(req),
                                funcName: funcName,
                                kind: "String",
                                expression: expression
                            }));
                        }
                        
                    }
                }
            });
        }
    });

    return functionConstraints;
}

/**
 * Traverse an object tree, calling the visitor at each
 * visited node.
 *
 * @param {Object}   object  Esprima node object.
 * @param {Function} visitor Visitor called at each node.
 */
function traverse(object, visitor) {

    // Call the visitor on the object
    visitor(object);

    // Traverse all children of object
    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            let child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}



// Export
module.exports = constraints;