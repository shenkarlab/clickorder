window.onload = addListeners;

function addListeners(){
    document.getElementById('noteWindow').addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

}

function mouseUp()
{
    window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e){
  window.addEventListener('mousemove', divMove, true);
}

function divMove(e){
  var div = document.getElementById('noteWindow');
  div.style.position = 'absolute';
  div.style.top = e.clientY + 'px';
  div.style.left = e.clientX + 'px';
}

// Port used to communicate with background.js
var port;
var portName = "applicationPort";

// Interval for refreshing application data
var refreshInterval = 1000;

  ////////////
 // EVENTS //
////////////

$("document").ready(function() 
{
    port = chrome.runtime.connect({name: portName});

    // Listen to messages from background.js
    port.onMessage.addListener(function(msg) {
        if (msg.type == "showNote")
        {
			console.log("Showing Note");
			loadPopupBox();
        }
    });
	
	// Write note button
    $( '#closeBtn' ).click(function() {
        port.postMessage({type: "closeNote"});
    });
});


 function unloadPopupBox() 
 {    // TO Unload the Popupbox
	 $('#noteWindow').fadeOut("slow");
 }    
 
 function loadPopupBox() 
 {    // To Load the Popupbox
	 $('#noteWindow').fadeIn("slow");       
 }      

