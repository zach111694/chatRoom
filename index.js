// EVENT EMITTER

function EventEmitter(){
  this.eventListeners = {};
}

EventEmitter.prototype.on = function(eventStr,handler){
  if(eventStr in this.eventListeners){
    this.eventListeners[eventStr].push(handler);
  } else {
    this.eventListeners[eventStr] = [handler];
  }
};

EventEmitter.prototype.emit = function(eventStr){
  var args = Array.prototype.slice.call(arguments,1);

  if(eventStr in this.eventListeners){
    this.eventListeners[eventStr].forEach(function(func){
      func.apply(null,args);
    });
  }
};

var chatServer = new EventEmitter();

chatServer.on("enter",function(data){
  document.getElementById("messages").innerHTML += "<p><strong>Chat Server: <i>" + data.user + "</strong> entered the chat room" + "</i></p>";
});

chatServer.on("leave",function(data){
  document.getElementById("messages").innerHTML += "<p><strong>Chat Server: <i>" + data.user + "</strong> " + "left the chat room" + "</i></p>";  
});

chatServer.on("message",function(data){
  var msgTemplate = document.getElementById("msgTemplate");
  var msgDisplay  = document.getElementById("messages");

  var data = {
    username: data.user,
    message: ": " + data.message
  };

  

  var clonedTemplate = instantiateNode(msgTemplate,data);
  clonedTemplate.style.display = "inline";
  msgDisplay.appendChild(clonedTemplate);
  window.scrollTo(0,document.body.scrollHeight);
});

function repeatedlySendRequest(username) {
	var req = new XMLHttpRequest();
	req.open("GET", "http://localhost:8000/?user=" + username, true);   
	req.send(null);
	req.addEventListener("load", function() {     
    var data = JSON.parse(req.responseText);
    chatServer.emit(data.event,data);
    repeatedlySendRequest(username);
	}); 
}

function sendChatEntranceRequest(username) {
	var req = new XMLHttpRequest();   
	req.open("GET", "http://localhost:8000/?user=" + username, true);
	req.send(null);
	req.addEventListener("load", function(){
		repeatedlySendRequest(username);
		var data = JSON.parse(req.responseText);
		document.getElementById("messages").innerHTML += "<h1>Welcome to Chat, " + data.user + "</h1>";
	}); 
} 

function sendMessage(username,message){
	var req = new XMLHttpRequest();
	req.open("GET","http://localhost:8000/?user="+username+"&message="+message,true);
	req.send(null);
}

function instantiateNode(node,data){
    var clonedNode = node.cloneNode(false);
    
    if(clonedNode.nodeType == document.ELEMENT_NODE){
      for(var i = 0; i < node.childNodes.length;i++){
        clonedNode.appendChild(instantiateNode(node.childNodes[i],data));
      }
    }

    if(clonedNode.nodeType == document.TEXT_NODE){
      var matches = clonedNode.nodeValue.match(/{{.+}}/g);

      if(matches != null){
        for(var j = 0; j < matches.length;j++){
          var match = (/{{(.+)}}/g).exec(clonedNode.nodeValue)[1];

          clonedNode.nodeValue = clonedNode.nodeValue.replace(matches[j],data[match]);
        }
      } 
    }
    return clonedNode;
  }

// AUTO-SELECT USERNAME INPUT FIELD
window.onload = function(){
	document.getElementById("usr").focus();
}

// SET USERNAME ON BUTTON CLICK AT LIGHTBOX
document.getElementById("submitBTN").addEventListener("click",function(){
	var usr = document.getElementById("usr").value;
	// SET HIDDEN INPUT VALUE TO USERNAME
	var hiddenUser = document.getElementById("hiddenUsr").value = usr;
    window.location.href = "#usernameRequest";
    // AUTO-SELECT MESSAGE INPUT FIELD
    document.getElementById("usrMsg").focus();
    sendChatEntranceRequest(usr);
});

// SET USERNAME ON ENTER KEY TO TRIGGER BUTTON CLICK AT LIGHTBOX
document.getElementById("usr").addEventListener("keyup",function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        document.getElementById("submitBTN").click();
    }
});

// SEND MESSAGE ON BUTTON CLICK
document.getElementById("msgBtn").addEventListener("click", function() {
	var msg = document.getElementById("usrMsg").value;
	// SET USERNAME FROM HIDDEN INPUT VALUE
	var username = document.getElementById("hiddenUsr").value;

	sendMessage(username, msg);

	// CLEAR TEXT INPUT
	document.getElementById("usrMsg").value = "";
});  

// SEND MESSAGE ON ENTER KEY TO TRIGGER BUTTON CLICK
document.getElementById("usrMsg").addEventListener("keyup",function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        document.getElementById("msgBtn").click();
    }
});



// MESSAGE TEMPLATE
// document.getElementById("msgBtn").addEventListener("click", function() {

//   var msgField    = document.getElementById("usrMsg");
//   var msgTemplate = document.getElementById("msgTemplate");
//   var msgDisplay  = document.getElementById("messages");
//   var usr = document.getElementById("hiddenUsr");

//   var data = {
//     username: usr.value,
//     message: ": " + msgField.value
//   };

//   function instantiateNode(node){
//   	var clonedNode = node.cloneNode(false);
    
//   	if(clonedNode.nodeType == document.ELEMENT_NODE){
//   		for(var i = 0; i < node.childNodes.length;i++){
//   			clonedNode.appendChild(instantiateNode(node.childNodes[i]));
//   		}
//   	}

//     if(clonedNode.nodeType == document.TEXT_NODE){
//       var matches = clonedNode.nodeValue.match(/{{.+}}/g);

//       if(matches != null){
//         for(var j = 0; j < matches.length;j++){
//           var match = (/{{(.+)}}/g).exec(clonedNode.nodeValue)[1];

//           clonedNode.nodeValue = clonedNode.nodeValue.replace(matches[j],data[match]);
//         }
//       } 
//     }
//     return clonedNode;
//   }
  
//   var clonedTemplate = instantiateNode(msgTemplate);
//   clonedTemplate.style.display = "inline";
  
//   msgDisplay.appendChild(clonedTemplate);
//   msgField.value = ""; 
// });




