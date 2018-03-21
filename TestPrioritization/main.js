var fs = require('fs'),
    xml2js = require('xml2js'),
    child  = require('child_process'); 
var parser = new xml2js.Parser();
var Bluebird = require('bluebird');
var args = process.argv.slice(2,3)[0];
var reportDir = args + '/builds/';
var fileName = '/junitResult.xml';

if(!args){
    console.log("Please pass directory path containing build info as an argument.");
}else{
    calculatePriority();
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

        // Calculate Average Running Time
        for(test in tests){
            tests[test].avg_time = parseFloat((tests[test].total_time / contents.length).toFixed(2));
            tests[test].total_time = parseFloat((tests[test].total_time).toFixed(2));
        }
        
        //Prioritize
        tests.sort(function(a,b){        
            return  b["time_failed"] - a["time_failed"] || b["time_passed"] - a["time_passed"] || a["avg_time"] - b["avg_time"] || a["total_time"] - b["total_time"];
        });
        
        tests.forEach( e => console.log(e));
    });
}

function getTestResults(callback){
    fs.readdir(reportDir, (err, dirs) => {
        try{
            var contents=[];
            for(var i = 0; i < dirs.length; i++){
                var regexp = '^([1-9]|\\d{2,})$';
                if(dirs[i].match(regexp)){
                    contents.push(fs.readFileSync(reportDir + dirs[i] + fileName));
                }
            }
        }catch(e){
            console.log("Please enter correct directory path.")
        }
        return callback(contents);
    }); 
}

function readResults(result,tests,isFirstTime)
{
    var testSuites = result.result.suites[0].suite;
    var testSuite = testSuites[0];
    for(var i = 0; i < testSuites.length; i++){
        var testSuite = testSuites[i];
        var testCases = testSuite.cases[0].case;
        for(var j = 0 ; j < testCases.length; j++){
            var testCase = testCases[j];
            var hasFailed = testCase.hasOwnProperty('errorStackTrace') || testCase.hasOwnProperty('errorDetails') || testCase.hasOwnProperty('stderr');
            if(isFirstTime){
                test = {name:testCase.testName[0],total_time: parseFloat(testCase.duration),time_passed:0,time_failed:0,avg_time: parseFloat(testCase.duration)};
                hasFailed ? test.time_failed++ : test.time_passed++;
                tests.push(test);
            }else{
                testIndex = tests.findIndex((testObj => testObj.name == testCase.testName[0]));
                tests[testIndex].total_time = tests[testIndex].total_time + parseFloat(testCase.duration);
                hasFailed ? tests[testIndex].time_failed++ : tests[testIndex].time_passed++;
            }
        }
    }
    return tests;    
}