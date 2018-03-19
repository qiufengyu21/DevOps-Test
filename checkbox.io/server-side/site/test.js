let sinon = require('sinon');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

let returnValue = {
	connect: 'abc'
}

var stubbedMongoClient = sinon.stub(MongoClient, "connect").returns(returnValue.connect);
let create = require('C:/Users/shash/DevOps/milestone-2/BuildTestAnalysis/checkbox.io/server-side/site/routes/create.js');

try { create.createStudy({"body":{"invitecode":"RESEARCH"}}, ''); } catch (e) {} 

try { create.createStudy({"body":{"invitecode":"RESEARCHRESEARCH"}}, ''); } catch (e) {} 

