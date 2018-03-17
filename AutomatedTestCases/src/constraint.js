// Core/NPM Modules
const esprima   = require("esprima");
const faker     = require("faker");
const fs        = require('fs');
const Random    = require('random-js');
const _         = require('lodash');
const randexp   = require('randexp');
const sinon     = require('sinon');
const sinonMong = require('sinon-mongoose');

// Set options
faker.locale  = "en";
const options = { tokens: true, tolerant: true, loc: true, range: true };



// Create random generator engine
const engine = Random.engines.mt19937().autoSeed();


/**
 * Constraint class. Represents constraints on function call parameters.
 *
 * @property {String}                                                          ident      Identity of the parameter mapped to the constraint.
 * @property {String}                                                          expression Full expression string for a constraint.
 * @property {String}                                                          operator   Operator used in constraint.
 * @property {String|Number}                                                   value      Main constraint value.
 * @property {String|Number}                                                   altvalue   Constraint alternative value.
 * @property {String}                                                          funcName   Name of the function being constrained.
 * @property {'fileWithContent'|'fileExists'|'integer'|'string'|'phoneNumber'} kind       Type of the constraint.
 */
class Constraint {
    constructor(properties){
        this.ident = properties.ident;
        this.expression = properties.expression;
        this.operator = properties.operator;
        this.value = properties.value;
        this.altvalue = properties.altvalue;
        this.funcName = properties.funcName;
        this.kind = properties.kind;
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

        // If some node is a function declaration, parse it for potential constraints.
        if (node.type === 'FunctionDeclaration') {

            // Get function name and arguments
            let funcName = functionName(node);
            let params = node.params.map(function(p) {return p.name});

            // Initialize function constraints
            functionConstraints[funcName] = {
                constraints: _.zipObject(params, _.map(params, () => [])),
                params: params
            };

            console.log(functionConstraints["basicCreate"].constraints);

            // Traverse function node.
            traverse(node, function(child) {
                
                if(funcName = "basicCreate"){
                    
                    for (let p in params) {
                        
                        // Get expression from original source code:
                        let expression = "";
                        
                        // Get identifier
                        let ident = params[p];
                        console.log("Ident: ",ident);
                        // Push a new constraint
                        let constraints = functionConstraints[funcName].constraints[ident];
                        constraints.push(new Constraint({
                            ident: params[p],
                            value:  "",
                            funcName: funcName,
                            kind: "string",
                            operator : child.operator,
                            expression: expression
                        }));
                    }
                }

                // if(funcName = "sendStudyEmail"){
                    
                //     // Get expression from original source code:
                //     let expression = buf.substring(child.range[0], child.range[1]);
                    
                //     for (let p in params) {
                //         // Get identifier
                //         let ident = params[p];

                //         // Push a new constraint
                //         let constraints = functionConstraints[funcName].constraints[ident];
                //         constraints.push(new Constraint({
                //             ident: params[p],
                //             value:  "",
                //             funcName: funcName,
                //             kind: "fileWithContent",
                //             operator : child.operator,
                //             expression: expression
                //         }));
                //     }
                // }
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
    if( greaterThan ) return Random.integer(constraintValue + 1, constraintValue + 10)(engine);
    else return Random.integer(constraintValue - 10, constraintValue - 1)(engine);
}

function normalize(phoneNumber) {
    return phoneNumber.replace(
        /^[\+\d{1,3}\-\s]*\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
        "$1$2$3"
      );
}

function format(formatString,phoneNumber){
    for ( var i = 0, l = phoneNumber.length; i < l; i++ ) {
        formatString = formatString.replace("N", phoneNumber[i]);
    }
    return formatString;
}

// Export
module.exports = constraints;