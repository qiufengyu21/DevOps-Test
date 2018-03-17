var subject = require('/Users/yuqiufeng/Desktop/checkbox.io/server-side/site/routes/csv.js');
var item = {
	votes: [{answers: [{kind: "singlechoice", answer: "test"}, {kind: "text", answer: "test"}]}, 
			{answers: [{kind: "textarea", answer: "test"}, {kind: "singlechoicetable", answer: "test"}]}]
};

var item2 = {
	votes: [{answers: [{kind: "singlechoice"}, {kind: "text"}]}, 
			{answers: [{kind: "textarea"}, {kind: "singlechoicetable"}]}]
};

try { subject.sizeOfRow(item)} catch (e) {};
try { subject.sizeOfRow(item2)} catch (e) {};
try { subject.formatJsonAsCSV(item)} catch (e) {};
try { subject.formatJsonAsCSV(item2)} catch (e) {};

/*
	Two problems:
		1. Have to manually add exports.function_name = function_name;
		2. Need to fully automate this file!
*/