// Core/NPM Modules
const esprima = require("esprima");
const faker   = require("faker");
const fs      = require('fs');
const Random  = require('random-js');
const _       = require('lodash');
const randexp = require('randexp');
var Regex = require("regex");


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

    let content = "";
    // Initialize function constraints directory
    let functionConstraints = {};

    // Read input file and parse it with esprima.
    let buf = fs.readFileSync(filePath, "utf8");
    let result = esprima.parse(buf, options);

    // Start traversing the root node
    traverse(result, function (node) {

        // If some node is a function declaration, parse it for potential constraints.
        if (node.type === 'Program') {

            // Traverse function node.
            traverse(node, function(child) {
                if(child.type == 'ExpressionStatement' && child.expression.type == 'CallExpression' && child.expression.callee.type == 'MemberExpression'){
                    if(child.expression.arguments[0].type == 'Literal' && child.expression.callee.object.name == 'app'){
                        var method = child.expression.callee.property.name;
                        var url = child.expression.arguments[0].value;
                        var http = "http://127.0.0.1";
                        //console.log(method + " " + url);
                        //console.log("***"+method);


                        // POST request
                        var kindObject = [{'kind': 'AMZN'},{'kind': 'SURFACE'},{'kind': 'IPADMINI'},{'kind': 'GITHUB'},{'kind': 'BROWSERSTACK'}];
                        if(method === 'post'){
                            console.log(url);
                            if(url === '/api/study/admin/notify/'){
                                for(i = 0; i < kindObject.length; i++){
                                    content += "request({\n\t" + 
                                    "url: \"" + http + url + "\",\n\t" +
                                    "method: \"" + method + "\",\n\t" +
                                    "json: " + JSON.stringify(kindObject[i]) + "\n})\n\n"
                                }
                            }
                        }
                        // GET request 
                        else if(method === 'get'){
                            //console.log("GET");
                            if(url === '/api/study/vote/status'){
                                content += "request({\n\t" + 
                                           "url: \"" + http + url + "\",\n\t" +
                                           "method: \"" + method + "\"" +
                                           "\n})\n\n"
                            }
                            else if(url === '/api/study/listing'){
                                content += "request({\n\t" + 
                                           "url: \"" + http + url + "\",\n\t" +
                                           "method: \"" + method + "\"" +
                                           "\n})\n\n"
                            }
                            else{
                                const Regex = /^(.*[\\\/])/;
                                const str = url;
                                let m;

                                if ((m = Regex.exec(str)) !== null) {
                                    //console.log(m[0]);
                                    var result = m[0];
                                }
                                content += "request({\n\t" + 
                                           "url: \"" + http + result + Random.integer(0,100)(engine) + "\",\n\t" +
                                           "method: \"" + method + "\"" +
                                           "\n})\n\n"
                            }
                        }
                        // We don't deal with OPTIONS request
                        else{
                            //console.log("OPTIONS request...");
                        }
                        //*/

                        /*
                        content += "request({\n\t" + 
                        "url: \"" + http + url + "\",\n\t" +
                        "method: \"" + method + "\",\n\t" +
                        "json: " + "{'kind': 'AMZN'}" + "\n})\n\n"
                        */
                        
                    }
                }

            });

            // console.log( functionConstraints[funcName]);

        }
    });

    return content;
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


// Export
module.exports = constraints;