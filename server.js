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
	response.end();
});

var server = http.createServer(function(request, response) {

	// SET RESPONSE NAME TO IP ADDRESS AND PORT
	// response.name = request.connection.remoteAddress + ":" + request.connection.remotePort;

	response.writeHead(200, {"Content-Type": "text/html", "Access-control-allow-origin": "*"});

	// IF URL REQUEST IS '/' OR JUST MAIN IP ADDRESS
	// if(request.url.length <= 1){
		// response.write("<h1>Welcome to Chat, " + response.name + "</h1><p>You asked for <code>" + request.url + "</code></p>");

		// PUSH CLIENT TO CLIENTLIST
		// clientList.push(response);
		// console.log("Number of users in chat: " + clientList.length);
		
		// ENTER CHAT ROOM
		// broadcast(response.name + " entered the chat room","Chat Server");
		// console.log(response.name + " entered the room");

	// } else if (request.url[1] === "?") {
		// clientList.push(response);
		// FILTER PATH AND QUERY (?) FROM REQUEST URL
		// var message = (request.url).slice(2,request.url.length);

		// BROADCAST MESSAGE
		// broadcast(message,response.name);
		// console.log(response.name + " says: " + message);
	// }

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