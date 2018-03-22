let request = require('request');

request({
	url: "http://127.0.0.1/api/design/survey",
	method: "post",
	json: {'kind': 'AMZN'}
})

request({
	url: "http://127.0.0.1/api/study/load/36",
	method: "get"
})

request({
	url: "http://127.0.0.1/api/study/vote/status",
	method: "get"
})

request({
	url: "http://127.0.0.1/api/study/status/100",
	method: "get"
})

request({
	url: "http://127.0.0.1/api/study/listing",
	method: "get"
})

request({
	url: "http://127.0.0.1/api/study/create",
	method: "post",
	json: {'kind': 'AMZN'}
})

request({
	url: "http://127.0.0.1/api/study/vote/submit/",
	method: "post",
	json: {'kind': 'AMZN'}
})

request({
	url: "http://127.0.0.1/api/study/admin/36",
	method: "get"
})

request({
	url: "http://127.0.0.1/api/study/admin/download/70",
	method: "get"
})

request({
	url: "http://127.0.0.1/api/study/admin/assign/81",
	method: "get"
})

request({
	url: "http://127.0.0.1/api/study/admin/open/",
	method: "post",
	json: {'kind': 'AMZN'}
})

request({
	url: "http://127.0.0.1/api/study/admin/close/",
	method: "post",
	json: {'kind': 'AMZN'}
})

request({
	url: "http://127.0.0.1/api/study/admin/notify/",
	method: "post",
	json: {'kind': 'AMZN'}
})

