let sinon = require('sinon');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

let returnValue = {
	connect: 'abc'
}

var stubbedMongoClient = sinon.stub(MongoClient, "connect").returns(returnValue.connect);
let create = require('C:\Users\shash\DevOps\milestone-2\BuildTestAnalysis\checkbox.io\server-side\site\routes\create.js');

try { subject.basicCreate('', '', "survey"); } catch (e) {} 

try { subject.basicCreate('', '', 'NEQ - survey'); } catch (e) {} 

try { subject.basicCreate('', '', "dataStudy"); } catch (e) {} 

try { subject.basicCreate('', '', 'NEQ - dataStudy'); } catch (e) {} 

try { subject.sendStudyEmail(''); } catch (e) {} 

