var fs = require('fs'),
    xml2js = require('xml2js'),
    child  = require('child_process'); 
var parser = new xml2js.Parser();
var Bluebird = require('bluebird')

var testReport =  '';//XML File path to report

calculatePriority();


function readResults(result)
{
    var tests = [];
    console.log("Result: ",result);
    for( var i = 0; i < result.testsuite['$'].tests; i++ )
    {
       tests.push({
        name:   testcase['$'].name, 
        time:   testcase['$'].time, 
        status: testcase.hasOwnProperty('failure') ? "failed": "passed"
        });
    }    
    return tests;
}

async function calculatePriority()
{
    try{
        child.execSync('cd simplecalc & mvn test');
    }catch(e){}
    var contents = fs.readFileSync(__dirname + testReport)
    let xml2json = await Bluebird.fromCallback(cb => parser.parseString(contents, cb));
    var tests = readResults(xml2json);
    tests.sort(function(a,b){
        if(a.status == b.status) return a.time - b.time;
        if(a.status == "failed" && b.status == "passed") return 1;
        if(b.status == "failed" && a.status == "passed") return 1;
    });
    
    tests.forEach( e => console.log(e));
}