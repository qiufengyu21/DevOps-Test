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
            test = {name:testcase['$'].name,total_time: parseFloat(testcase['$'].time),time_passed:0,time_failed:0,avg_time: parseFloat(testcase['$'].time)};
            testcase.hasOwnProperty('failure') ? test.time_failed++ : test.time_passed++;
            tests.push(test);
        }else{
            testIndex = tests.findIndex((testObj => testObj.name == testcase['$'].name));
            tests[testIndex].total_time = tests[testIndex].total_time + parseFloat(testcase['$'].time);
            testcase.hasOwnProperty('failure') ? tests[testIndex].time_failed++ : tests[testIndex].time_passed++;
        }
    }
    return tests;    
}

function calculatePriority()
{    
    getTestResults(async function(contents){
        var tests = [];
        for(var i = 0; i < contents.length; i++){
            let xml2json = await Bluebird.fromCallback(cb => parser.parseString(contents[i], cb));
            var isFirstTime = false;
            if(i == 0)
                isFirstTime = true;
            tests = readResults(xml2json,tests,isFirstTime);
        }
        
        //Calculate Average Running Time
        for(test in tests){
            tests[test].avg_time = parseFloat((tests[test].total_time / contents.length).toFixed(2));
        }
        
        //Prioritize
        tests.sort(function(a,b){        
            return  b["time_failed"] - a["time_failed"] || b["time_passed"] - a["time_passed"] || a["avg_time"] - b["avg_time"];
        });
        
        tests.forEach( e => console.log(e));
    });
}

function getTestResults(callback){
    fs.readdir(__dirname + reportDir, (err, dirs) => {
        var contents=[];
        for(var i = 0; i < dirs.length; i++){
            contents.push(fs.readFileSync(__dirname + reportDir + dirs[i] + fileName));
        }
        return callback(contents);
    }); 
}