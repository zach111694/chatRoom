document.getElementById("msgBtn").addEventListener("click", function() {
  var msgField    = document.getElementById("usrMsg");
  var msgTemplate = document.getElementById("msgTemplate");
  var msgDisplay  = document.getElementById("messages");
  
  var data = {
    username: "Alice",
    message: msgField.value,
    test: "test"
  };
  
  for(var i = 0; i < msgTemplate.childNodes.length; i++) {
    var clonedNode = msgTemplate.childNodes[i].cloneNode(true);
    if(clonedNode.nodeType == document.ELEMENT_NODE) {
      var arrMatches = clonedNode.innerHTML.match(/{{2}[^}]+}{2}/g);
      for(var j = 0;j < arrMatches.length; j++){
        var match = arrMatches[j].substring(2,arrMatches[j].length-2);
        clonedNode.innerHTML = clonedNode.innerHTML.replace(arrMatches[j],data[match]);
      }
    }
 
    msgDisplay.appendChild(clonedNode);
  }
  
  msgField.value = "";
});

