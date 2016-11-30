// TODO: HANDLE SAME USERNAME CASE //
var http = require("http");

//ARRAY HOLDING ROUTES
var routes = [];

// ARRAY HOLDING USERNAMES
var usernames = [];

// ARRAY HOLDING REPONSE OBJECTS
var clientList = [];

// INDEX & USERNAME ROUTE
addRoute("GET", /^\/\?user=\w+$/,/user=(\w+)/,function(req, res, data) {
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

// MESSAGE ROUTE
addRoute("GET", /^\/\?user=.+\&message=[^\&]+$/,/user=(\w+)&message=(.+)/,function(req, res, data) {

	res.name = data.user;

	// REPLACE ASCII CODE
	data.message = data.message.split('%20').join(' ').split('%27').join('\'');
	
	data.event = "message";
	var dataStr = JSON.stringify(data);
	broadcast(dataStr);
	res.end();
});

// CREATE SERVER
var server = http.createServer(function(request, response) {
	response.writeHead(200, {"Content-Type": "text/html", "Access-control-allow-origin": "*"});

	resolve(request,response);

	// ON WINDOW OR BROWSER DISCONNECT
	request.on("close",function(){
		var dataStr = JSON.stringify({
			user: response.name,
			event: "leave"
		});

		// REMOVE RESPONSE OBJECT
		clientList.splice(clientList.indexOf(response),1);
		// ANNOUNCE DISCONNECT TO OTHER USERS
		broadcast(dataStr);
		response.end();
	});
});

function broadcast(dataObj){
	// WRITE TO ALL USERS CONNECTED
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
	var queryString = req.url;

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