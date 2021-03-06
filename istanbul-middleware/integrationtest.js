let request = require('request');

request({
	url: "http://127.0.0.1/api/study/load/93",
	method: "get"
})

request({
	url: "http://127.0.0.1/api/study/vote/status",
	method: "get"
})

request({
	url: "http://127.0.0.1/api/study/status/84",
	method: "get"
})

request({
	url: "http://127.0.0.1/api/study/listing",
	method: "get"
})

request({
	url: "http://127.0.0.1/api/study/create",
	method: "post",
	json: {"invitecode":"XXX","studyKind":"survey"}
})

request({
	url: "http://127.0.0.1/api/study/create",
	method: "post",
	json: {"invitecode":"RESEARCH","studyKind":"survey"}
})

request({
	url: "http://127.0.0.1/api/study/create",
	method: "post",
	json: {"invitecode":"RESEARCH","studyKind":"dataStudy"}
})

request({
	url: "http://127.0.0.1/api/study/admin/71",
	method: "get"
})

request({
	url: "http://127.0.0.1/api/study/admin/download/99",
	method: "get"
})

request({
	url: "http://127.0.0.1/api/study/admin/assign/1",
	method: "get"
})

request({
	url: "http://127.0.0.1/api/study/admin/notify/",
	method: "post",
	json: {"kind":"AMZN"}
})

request({
	url: "http://127.0.0.1/api/study/admin/notify/",
	method: "post",
	json: {"kind":"SURFACE"}
})

request({
	url: "http://127.0.0.1/api/study/admin/notify/",
	method: "post",
	json: {"kind":"IPADMINI"}
})

request({
	url: "http://127.0.0.1/api/study/admin/notify/",
	method: "post",
	json: {"kind":"GITHUB"}
})

request({
	url: "http://127.0.0.1/api/study/admin/notify/",
	method: "post",
	json: {"kind":"BROWSERSTACK"}
})

