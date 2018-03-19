var fs = require('fs'),
    xml2js = require('xml2js'),
    child  = require('child_process'); 
var parser = new xml2js.Parser();
var Bluebird = require('bluebird');
var reportDir =  '/Reports/';
var fileName = '/TEST-com.github.stokito.unitTestExample.calculator.CalculatorTest.xml';

calculatePriority();

function readResults(result,tests,isFirstTime)
{
    for( var i = 0; i < result.testsuite['$'].tests; i++ )
    {
        var testcase = result.testsuite.testcase[i];
        if(isFirstTime){
            test = {name:testcase['$'].name,time: parseFloat(testcase['$'].time),timePassed:0,timeFailed:0};
            testcase.hasOwnProperty('failure') ? test.timeFailed++ : test.timePassed++;
            tests.push(test);
        }else{
            testIndex = tests.findIndex((testObj => testObj.name == testcase['$'].name));
            tests[testIndex].time = tests[testIndex].time + parseFloat(testcase['$'].time);
            testcase.hasOwnProperty('failure') ? tests[testIndex].timeFailed++ : tests[testIndex].timePassed++;
        }
    }
    return tests;    
}

async function calculatePriority()
{
    var tests = [];
    for(var i = 1; i <= 3; i++){
        var contents = fs.readFileSync(__dirname + reportDir + i + fileName);
        let xml2json = await Bluebird.fromCallback(cb => parser.parseString(contents, cb));
        var isFirstTime = false;
        if(i == 1)
            isFirstTime = true;
        tests = readResults(xml2json,tests,isFirstTime);
    }

    tests.forEach( e => console.log(e));
    tests.sort(function(a,b){
        
        return  b["timeFailed"] - a["timeFailed"] || b["timePassed"] - a["timePassed"] || b["time"] - a["time"];
    });
    tests.forEach( e => console.log(e));
}