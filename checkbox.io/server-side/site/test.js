console.log('Start of test')
let sinon = require('sinon');
console.log('Before stub');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

let returnValue = {
    connect: 'abc'
}

//need to send correctly mocked db
var stubbedMongoClient = sinon.stub(MongoClient, "connect").returns(returnValue.connect);
console.log('After stub');

let create = require('C:/Users/shash/DevOps/milestone-2/BuildTestAnalysis/checkbox.io/server-side/site/routes/create.js');

try {
    var bodyObj = {invitecode:"RESEARCH", studyKind: "dataStudy"};
    var req = {body: bodyObj};
    create.createStudy(req, '');
} catch (e) {
    console.log(e);
}

try {
    bodyObj = {invitecode:"RESEARCH", studyKind: "survey"};
    req = {body: bodyObj};
    create.createStudy(req, '');

} catch (e) {
    console.log(e);
}

try {
    bodyObj = {invitecode:"INVALIDCODE", studyKind: "dataStudy"};
    req = {body: bodyObj};
    create.createStudy(req, '');
} catch (e) {
    console.log(e);
}

try {
    bodyObj = {invitecode:"RESEARCH", studyKind: "INVALIDKIND"};
    req = {body: bodyObj};
    create.createStudy(req, '');
} catch (e) {
    console.log(e);
}
