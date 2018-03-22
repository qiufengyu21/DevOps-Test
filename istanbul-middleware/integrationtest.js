let request = require('request');

request({
	url: "http://127.0.0.1/api/study/vote/submit/",
	method: "options",
	json: {'kind': 'AMZN'}
})

request({
	url: "http://127.0.0.1/api/design/survey",
	method: "post",
	json: {'kind': 'AMZN'}
})

request({
	url: "http://127.0.0.1/api/study/load/:id",
	method: "get",
	json: {'kind': 'AMZN'}
})

request({
	url: "http://127.0.0.1/api/study/vote/status",
	method: "get",
	json: {'kind': 'AMZN'}
})

request({
	url: "http://127.0.0.1/api/study/status/:id",
	method: "get",
	json: {'kind': 'AMZN'}
})

request({
	url: "http://127.0.0.1/api/study/listing",
	method: "get",
	json: {'kind': 'AMZN'}
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
	url: "http://127.0.0.1/api/study/admin/:token",
	method: "get",
	json: {'kind': 'AMZN'}
})

request({
	url: "http://127.0.0.1/api/study/admin/download/:token",
	method: "get",
	json: {'kind': 'AMZN'}
})

request({
	url: "http://127.0.0.1/api/study/admin/assign/:token",
	method: "get",
	json: {'kind': 'AMZN'}
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

