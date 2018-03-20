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

let admin = require('C:/Users/shash/DevOps/milestone-2/BuildTestAnalysis/checkbox.io/server-side/site/routes/admin.js');

try { admin.loadStudy('', ''); } catch (e) {} 

try { admin.openStudy('', ''); } catch (e) {} 

try { admin.closeStudy('', ''); } catch (e) {} 

try { admin.download('', ''); } catch (e) {} 

try { admin.assignWinner('', ''); } catch (e) {} 

try { admin.notifyParticipant('', ''); } catch (e) {} 

let study = require('C:/Users/shash/DevOps/milestone-2/BuildTestAnalysis/checkbox.io/server-side/site/routes/study.js');

try { study.listing('', ''); } catch (e) {} 

try { study.loadStudy('', ''); } catch (e) {} 

try { study.status('', ''); } catch (e) {} 

try { study.voteStatus('', ''); } catch (e) {} 

try { study.submitVote('', ''); } catch (e) {} 

