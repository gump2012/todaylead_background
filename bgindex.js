var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var db = require("./db");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/showorders"] = requestHandlers.showorder;
handle["/addexpress"] = requestHandlers.addexpress;
handle["/sendmail"] = requestHandlers.sendmail;
handle["/showdeleteorders"] = requestHandlers.showdeleteorder;

server.start(router.route, handle);
db.start();