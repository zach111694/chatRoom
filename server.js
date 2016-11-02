var http = require("http");

var routes = [];
var usernames = [];
// LIST OF CLIENTS
var clientList = [];


// addRoute("GET", /^\/$/,/^\/$/,function(req, res, data) {
// 	clientList.push(res);
// });

addRoute("GET", /^\/\?user=\w+$/,/user=(\w+)/,function(req, res, data) {

	// data.welcome = "<h1>Welcome to Chat, " + data.user + "</h1>";
	// data.message = "Chat Server: " + data.user + " entered the chat room";
	if(usernames.indexOf(data.user) != -1){
		clientList.push(res);
		res.name = data.user;
	} else {
		usernames.push(data.user);
		data.event = "enter";
		dataStr = JSON.stringify(data);
		res.write(dataStr);
		broadcast(dataStr);
		res.end();
	}
});

addRoute("GET", /^\/\?user=\w+\&message=[^\&]+$/,/user=(\w+)&message=([^\&]+)/,function(req, res, data) {

	res.name = data.user;

	broadcast(data.message,data.user);
	console.log(data.user+ " says: " + data.message);
});

var server = http.createServer(function(request, response) {

	response.writeHead(200, {"Content-Type": "text/html", "Access-control-allow-origin": "*"});
	
	resolve(request,response);

	request.on("close",function(){

		var dataStr = JSON.stringify({
			user: response.name,
			event: "leave"
		});

		clientList.splice(clientList.indexOf(response),1);
		broadcast(dataStr);
		response.end();
	});
});

function broadcast(dataObj){
	clientList.forEach(function(participant) {
		participant.write(dataObj);
		participant.end();
	});

	clientList = [];
}

function addRoute(method,url,data,handler){
	routes.push(
		{
			method: method,
			url: url,
			data: data,
			handler: handler
		}
	);
}

function resolve(req,res){
	console.log("=====================");
	var queryString = req.url;
	console.log(req.url);
	for(var i = 0; i < routes.length; i++){
		if(routes[i].method == req.method && routes[i].url.test(queryString)){
			
			queryData = {
				user:'',
				message:''
			};

			var regex = routes[i].data;
			
			queryData.user = regex.exec(queryString)[1];
			queryData.message = regex.exec(queryString)[2];

			routes[i].handler(req,res,queryData);
		}
	}

}

server.listen(8000);