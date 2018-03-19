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
        if (node.type) {
            console.log(JSON.stringify(node.type));
        }

        // If some node is a function declaration, parse it for potential constraints.
        if (node.type === 'FunctionDeclaration') {
            // Get function name and arguments
            let funcName = functionName(node);
            let params = node.params.map(function (p) { return p.name });

            //Initialize function constraints
            functionConstraints[funcName] = {
                constraints: _.zipObject(params, _.map(params, () => [])),
                params: params
            };

            // Traverse function node.
            traverse(node, function (child) {

                // Handle equivalence expression
                if (_.get(child, 'type') === 'BinaryExpression' && _.includes(['!=', '!==', '==', '===', '<', '>', '<=', '>='], _.get(child, 'operator'))) {
                    if (_.get(child, 'left.type') === 'Identifier') {

                        // Get identifier
                        let ident = child.left.name;

                        // Get expression from original source code:
                        let expression = buf.substring(child.range[0], child.range[1]);
                        let rightHand = buf.substring(child.right.range[0], child.right.range[1]);
                        // Test to see if right hand is a string
                        let match = rightHand.match(/^['"](.*)['"]$/);
                        let constraints = functionConstraints[funcName].constraints[ident];
                        if (_.includes(params, _.get(child, 'left.name'))) {

                            // Push a new constraints
                            constraints.push(new Constraint({
                                ident: child.left.name,
                                value: rightHand,
                                funcName: funcName,
                                kind: "integer",
                                operator: child.operator,
                                expression: expression
                            }));
                            constraints.push(new Constraint({
                                ident: child.left.name,
                                value: match ? `'NEQ - ${match[1]}'` : NaN,
                                funcName: funcName,
                                kind: "integer",
                                operator: child.operator,
                                expression: expression
                            }));
                            if (!isNaN(rightHand)) {
                                constraints.push(new Constraint({
                                    ident: child.left.name,
                                    value: createConcreteIntegerValue(parseInt(rightHand), true),
                                    funcName: funcName,
                                    kind: "integer",
                                    operator: child.operator,
                                    expression: expression
                                }));
                                constraints.push(new Constraint({
                                    ident: child.left.name,
                                    value: createConcreteIntegerValue(parseInt(rightHand), false),
                                    funcName: funcName,
                                    kind: "integer",
                                    operator: child.operator,
                                    expression: expression
                                }));
                            }
                        }
                    }
                }

                if (_.get(child, 'type') === 'BinaryExpression' && child.left && child.left.name === 'area') {
                    let rightHand = buf.substring(child.right.range[0], child.right.range[1]);
                    let expression = buf.substring(child.range[0], child.range[1]);
                    for (let p in params) {

                        let ident = params[p];
                        functionConstraints[funcName].constraints[params].push(new Constraint({
                            ident: params[p],
                            value: "'" + faker.phone.phoneNumberFormat() + "'",
                            funcName: funcName,
                            kind: "integer",
                            operator: child.operator,
                            expression: expression
                        }));
                        rightHand = rightHand.substring(1, rightHand.length - 1);
                        functionConstraints[funcName].constraints[ident].push(new Constraint({
                            ident: params[p],
                            value: "'" + rightHand.replace(/"/g, '') + faker.phone.phoneNumberFormat().substring(3, 12) + "'",
                            funcName: funcName,
                            kind: "integer",
                            operator: child.operator,
                            expression: expression
                        }));
                    }
                }

                if (child.type === "CallExpression" && child.callee.property && child.callee.property.name === "existsSync") {
                    // Get expression from original source code:
                    let expression = buf.substring(child.range[0], child.range[1]);
                    for (let p in params) {
                        //console.log('argument name: ' + child.arguments[0].name);
                        if (child.arguments[0].name === params[p]) {

                            // Get identifier
                            let ident = params[p];

                            // Push a new constraint
                            functionConstraints[funcName].constraints[ident].push(new Constraint({
                                ident: params[p],
                                value: "'emptyDir'",
                                funcName: funcName,
                                kind: "pathExists",
                                operator: child.operator,
                                expression: expression
                            }));
                            // Push a new constraint
                            functionConstraints[funcName].constraints[ident].push(new Constraint({
                                ident: params[p],
                                value: "'nonEmptyDir'",
                                funcName: funcName,
                                kind: "pathExists",
                                operator: child.operator,
                                expression: expression
                            }));
                        }
                    }
                }

                // Handle fs.readFileSync
                if (child.type === "CallExpression" && child.callee.property && child.callee.property.name === "readFileSync") {
                    // Get expression from original source code:
                    let expression = buf.substring(child.range[0], child.range[1]);
                    for (let p in params) {
                        //console.log('argument name: ' + child.arguments[0].name);
                        if (child.arguments[0].name === params[p]) {

                            // Get identifier
                            let ident = params[p];

                            // Push a new constraint
                            functionConstraints[funcName].constraints[ident].push(new Constraint({
                                ident: params[p],
                                value: "'pathContent/file1'",
                                funcName: funcName,
                                kind: "fileWithContent",
                                operator: child.operator,
                                expression: expression
                            }));
                            functionConstraints[funcName].constraints[ident].push(new Constraint({
                                ident: params[p],
                                value: "'pathContent/someDir'",
                                funcName: funcName,
                                kind: "fileWithContent",
                                operator: child.operator,
                                expression: expression
                            }));
                            functionConstraints[funcName].constraints[ident].push(new Constraint({
                                ident: params[p],
                                value: "'file'",
                                funcName: funcName,
                                kind: "pathExists",
                                operator: child.operator,
                                expression: expression
                            }));
                            functionConstraints[funcName].constraints[ident].push(new Constraint({
                                ident: params[p],
                                value: "'emptyDir'",
                                funcName: funcName,
                                kind: "pathExists",
                                operator: child.operator,
                                expression: expression
                            }));
                        }
                    }
                }

                if (child.type === "IfStatement" && child.test.left && child.test.left.callee && child.test.left.callee.object.name === 'mode') {
                    let expression = buf.substring(child.range[0], child.range[1]);
                    let ident = child.test.left.callee.object.name;
                    let modeArr = [];
                    modeArr[0] = child.test.left.arguments[0].value;
                    functionConstraints[funcName].constraints[ident].push(new Constraint({
                        ident: ident,
                        value: "'" + modeArr + "'",
                        funcName: funcName,
                        operator: child.operator,
                        expression: expression
                    }));
                }

                if (child.type === "IfStatement" && child.test.right && child.test.right.argument && child.test.right.argument.property.name === 'normalize') {
                    let expression = buf.substring(child.range[0], child.range[1]);
                    let ident = child.test.left.argument.name;
                    let options = {};
                    let objProperty = child.test.right.argument.property.name;
                    options[objProperty] = true;
                    functionConstraints[funcName].constraints[ident].push(new Constraint({
                        ident: ident,
                        value: JSON.stringify(options),
                        funcName: funcName,
                        operator: child.operator,
                        expression: expression
                    }));
                    options[objProperty] = false;
                    functionConstraints[funcName].constraints[ident].push(new Constraint({
                        ident: ident,
                        value: JSON.stringify(options),
                        funcName: funcName,
                        operator: child.operator,
                        expression: expression
                    }));
                }


                if (child.type === "CallExpression" && child.callee.property && child.callee.property.name === "replace") {
                    // Get expression from original source code:
                    let expression = buf.substring(child.range[0], child.range[1]);
                    for (let p in params) {

                        if (child.arguments[1].object && child.arguments[1].object.name === params[p]) {

                            // Get identifier
                            let ident = params[p];
                            // Push a new constraint
                            functionConstraints[funcName].constraints[ident].push(new Constraint({
                                ident: params[p],
                                value: "'" + faker.phone.phoneNumberFormat() + "'",
                                funcName: funcName,
                                operator: child.operator,
                                expression: expression
                            }));
                        }
                    }
                }
            });

            // console.log( functionConstraints[funcName]);

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


/**
 * Return the name of a function node.
 */
function functionName(node) {
    return node.id ? node.id.name : '';
}


/**
 * Generates an integer value based on some constraint.
 *
 * @param   {Number}  constraintValue Constraint integer.
 * @param   {Boolean} greaterThan     Whether or not the concrete integer is greater than the constraint.
 * @returns {Number}                  Integer satisfying constraints.
 */
function createConcreteIntegerValue(constraintValue, greaterThan) {
    if (greaterThan) return Random.integer(constraintValue + 1, constraintValue + 10)(engine);
    else return Random.integer(constraintValue - 10, constraintValue - 1)(engine);
}


// Export
module.exports = constraints;