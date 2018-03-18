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

let create = require('E:/Courses/CSC_519_DevOps/Project_ML2/ML2/BuildTestAnalysis/checkbox.io/server-side/site/routes/create.js');
let admin = require('E:/Courses/CSC_519_DevOps/Project_ML2/ML2/BuildTestAnalysis/checkbox.io/server-side/site/routes/admin.js');
let admin = require('E:/Courses/CSC_519_DevOps/Project_ML2/ML2/BuildTestAnalysis/checkbox.io/server-side/site/routes/study.js');


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

try{
    paramObj = {token: "exists"};
    req = {params: paramObj};
    admin.loadStudy(req,"");
}catch (e){
    console.log(e);
}

try{
    paramObj = {token: "notExists"};
    req = {params: paramObj};
    admin.loadStudy(req,"");
}catch (e){
    console.log(e);
}

try{
    paramObj = {token: "exists"};
    req = {params: paramObj};
    admin.openStudy(req,"");
}catch (e){
    console.log(e);
}

try{
    paramObj = {token: "notExists"};
    req = {params: paramObj};
    admin.openStudy(req,"");
}catch (e){
    console.log(e);
}

try{
    paramObj = {token: "exists"};
    req = {params: paramObj};
    admin.closeStudy(req,"");
}catch (e){
    console.log(e);
}

try{
    paramObj = {token: "notExists"};
    req = {params: paramObj};
    admin.closeStudy(req,"");
}catch (e){
    console.log(e);
}

try{
    paramObj = {token: "exists"};
    req = {params: paramObj};
    admin.download(req,"");
}catch (e){
    console.log(e);
}

try{
    paramObj = {token: "notExists"};
    req = {params: paramObj};
    admin.download(req,"");
}catch (e){
    console.log(e);
}

try{
    paramObj = {token: "exists"};
    req = {params: paramObj};
    admin.assignWinner(req,"");
}catch (e){
    console.log(e);
}

try{
    paramObj = {token: "notExists"};
    req = {params: paramObj};
    admin.assignWinner(req,"");
}catch (e){
    console.log(e);
}

try{
    bodyObj = {email: "abc@gmail.com",kind:"AMZN"};
    req = {body: bodyObj};
    admin.notifyParticipant(req,"");
}catch (e){
    console.log(e);
}

try{
    bodyObj = {email: "abc@gmail.com",kind:"SURFACE"};
    req = {body: bodyObj};
    admin.notifyParticipant(req,"");
}catch (e){
    console.log(e);
}

try{
    bodyObj = {email: "abc@gmail.com",kind:"IPADMINI"};
    req = {body: bodyObj};
    admin.notifyParticipant(req,"");
}catch (e){
    console.log(e);
}

try{
    bodyObj = {email: "abc@gmail.com",kind:"BROWSERSTACK"};
    req = {body: bodyObj};
    admin.notifyParticipant(req,"");
}catch (e){
    console.log(e);
}

try{
    admin.listing("","");
}catch (e){
    console.log(e);
}

try{
    bodyObj = {};
    req = {body: bodyObj};
    admin.listing(req,"");
}catch (e){
    console.log(e);
}

try{
    paramObj = {id: "exists"};
    req = {params: paramObj};
    admin.loadStudy(req,"");
}catch (e){
    console.log(e);
}

try{
    paramObj = {id: "notExists"};
    req = {params: paramObj};
    admin.loadStudy(req,"");
}catch (e){
    console.log(e);
}

try{
    paramObj = {id: "exists"};
    req = {params: paramObj};
    admin.status(req,"");
}catch (e){
    console.log(e);
}

try{
    paramObj = {id: "notExists"};
    req = {params: paramObj};
    admin.status(req,"");
}catch (e){
    console.log(e);
}

try{
    queryObj = {studyId: "exists", fingerprint:"exists"};
    connectionObj = "0.0.0.0";
    req = {params: paramObj, connection:connectionObj};
    admin.voteStatus(req,"");
}catch (e){
    console.log(e);
}

try{
    queryObj = {studyId: "exists", fingerprint:"notExists"};
    connectionObj = "0.0.0.0";
    req = {params: paramObj, connection:connectionObj};
    admin.voteStatus(req,"");
}catch (e){
    console.log(e);
}

try{
    bodyObj = {studyId: "notExists", fingerprint:"notExists",answers:"",email:"abc@gmail.com",contact:"1234567890"};
    connectionObj = "0.0.0.0";
    fileObj = {files: "fakeNonEmptyFilePath"};
    req = {params: bodyObj, connection:connectionObj, files:fileObj};
    admin.submitVote(req,"");
}catch (e){
    console.log(e);
}

try{
    bodyObj = {studyId: "notExists", fingerprint:"notExists",answers:"",email:"abc@gmail.com",contact:"1234567890"};
    connectionObj = "0.0.0.0";
    req = {params: bodyObj, connection:connectionObj};
    admin.submitVote(req,"");
}catch (e){
    console.log(e);
}
