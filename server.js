var http = require("http");

var routes = [];

// LIST OF CLIENTS
var clientList = [];


//(message=)([^\&]+)

addRoute("GET", /^\/$/,/^\/$/,function(req, res, data) {
	clientList.push(res);

});

addRoute("GET", /^\/\?user=\w+$/,/user=(\w+)/,function(req, res, data) {

	res.write("<h1>Welcome to Chat, " + data.user + "</h1><p>You asked for <code>" + req.url + "</code></p>");
	res.name = data.user;
	clientList.push(res);
	console.log("Number of users in chat: " + clientList.length);
	broadcast(data.user + " entered the chat room","Chat Server");
	console.log(data.user + " entered the room");

});

addRoute("GET", /^\/\?user=\w+\&message=[^\&]+$/,/user=(\w+)&message=([^\&]+)/,function(req, res, data) {
	clientList.push(res);
	res.name = data.name;
	broadcast(data.message,data.user);
	console.log(data.user+ " says: " + data.message);
	// res.end();
});

var server = http.createServer(function(request, response) {

	response.writeHead(200, {"Content-Type": "text/html", "Access-control-allow-origin": "*"});

	// WHEN USER LEAVES CHAT
	
	resolve(request,response);

	request.on("close",function(){

			// NOTIFY EVERYONE WHO LEFT THE CHAT
			clientList.splice(clientList.indexOf(response),1);
			broadcast("Goodbye, " + response.name + ". See you next time!\n","Chat Server");
			console.log(response.name + " left the room");
			console.log("Number of users in chat: " + clientList.length);

	});

	// response.end();
});

function broadcast(message,client){
	clientList.forEach(function(participant) {
		participant.write("<p><strong>" + client + "</strong> : " + message + "</p>");
	});
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

		// routes[i].url.test(queryString);
	}
}



server.listen(8000);