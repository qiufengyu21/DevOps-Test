let request = require('request');

request({
	url: "http://127.0.0.1/api/study/load/59",
	method: "get"
})

request({
	url: "http://127.0.0.1/api/study/vote/status",
	method: "get"
})

request({
	url: "http://127.0.0.1/api/study/status/53",
	method: "get"
})

request({
	url: "http://127.0.0.1/api/study/listing",
	method: "get"
})

request({
	url: "http://127.0.0.1/api/study/admin/90",
	method: "get"
})

request({
	url: "http://127.0.0.1/api/study/admin/download/19",
	method: "get"
})

request({
	url: "http://127.0.0.1/api/study/admin/assign/62",
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

