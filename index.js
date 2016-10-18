function repeatedlySendRequest() {
	var req = new XMLHttpRequest();   
	req.open("GET", "http://localhost:8000/", true);   
	req.send(null); // send request w/no request body (used for POST requests)   
	req.addEventListener("load", function() {     
		console.log(req.responseText);    
		repeatedlySendRequest(); // repeat request once response has been processed   
	}); 
}

function sendChatEntranceRequest(username) {
	var req = new XMLHttpRequest();   
	req.open("GET", "http://localhost:8000/?user=" + username, true);
	
	req.send(null); // send request w/no request body (used for POST requests)   
	req.addEventListener("load", function() { 
		console.log(req.responseText); 
	}); 
} 

document.getElementById("msgSubmitButton").addEventListener("click", function() {
	var msg = document.getElementById("messageField").value;
	var username = document.getElementById("hiddenField").value; // other options?
	sendMessage(username, message); // implement like sendChatEntranceRequest,refactoring?
});  


function myFunction(){
    var usr = document.getElementById("usr").value;
    // alert(usr);
    sendChatEntranceRequest(usr);
  }

function load(){
window.location.href = "#usernameRequest";
}