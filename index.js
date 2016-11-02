// document.addEventListener("DOMContentLoaded", function(event){
//     repeatedlySendRequest();
//  });

function repeatedlySendRequest(username) {

	var req = new XMLHttpRequest();   
	req.open("GET", "http://localhost:8000/?user=" + username, true);   
	req.send(null); // send request w/no request body (used for POST requests)   
	req.addEventListener("load", function() {     
		var data = JSON.parse(req.responseText);
		if(data.event == "enter"){
			document.getElementById("msgTextArea").innerHTML += "<p><strong>Chat Server:</strong> " + data.user + " entered the chat room";
		} else if(data.event == "leave"){
			document.getElementById("msgTextArea").innerHTML += "<p><strong>Chat Server: </strong> Goodbye, <strong>" + data.user + "</strong>. " + "See you next time!\n";
		}

		repeatedlySendRequest(username); // repeat request once response has been processed   
	}); 
}

function sendChatEntranceRequest(username) {
	var req = new XMLHttpRequest();   
	req.open("GET", "http://localhost:8000/?user=" + username, true);
	
	req.send(null); // send request w/no request body (used for POST requests)   

	req.addEventListener("load", function(){ 
		repeatedlySendRequest(username);

		var data = JSON.parse(req.responseText);
		console.log(data);
		document.getElementById("msgTextArea").innerHTML += "<h1>Welcome to Chat, " + data.user + "</h1>";
	}); 
} 

var btn = document.getElementById("submitBTN");

btn.addEventListener("click",function(event){
	var usr = document.getElementById("usr").value;
    window.location.href = "#usernameRequest";
    sendChatEntranceRequest(usr);
});

// document.getElementById("msgBtn").addEventListener("click", function() {
// 	var msg = document.getElementById("messageField").value;
// 	var username = document.getElementById("hiddenField").value; // other options?
// 	sendMessage(username, message); // implement like sendChatEntranceRequest,refactoring?
// });  




