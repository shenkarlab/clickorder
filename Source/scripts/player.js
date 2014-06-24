var dataOnj = [{"id":"url","name":"http://www.shenkar.ac.il/home/","time":1403602325131},
{"id":"click_a","name":"window.location = '../template/default.aspx?maincat=5'","time":1403602330388},
{"id":"scroll","name":"0,100","time":1403602333760},
{"id":"scroll","name":"0,200","time":1403602335803},
{"id":"click_a","name":"window.open('../template/default.aspx?PageId=26&catId=14&maincat=5'), _self)","time":1403602338640},
{"id":"click_input_text","name":"#search_txt","time":1403602342016},
{"id":"scroll","name":"0,100","time":1403602349255},
{"id":"scroll","name":"0,135","time":1403602350802}];


var DEBUG = true;
var recordingName = "Test";	// Comment when not debug
var recordingData;

var deltaPink = 0;
var thread;
var url;
var isPlaying;
var currentTime;
var totalDuration;

var playedEvents = new Array();

var maxTimeMin;
var minTimeMin;
var maxTimeSec;
var minTimeSec;

document.onreadystatechange = function () {
     if (document.readyState == "complete") {
		//init();
   }
 } 
 
function init(){
	reset();

	// Hide note
	document.getElementById('noteWindow').style.display='none';

	if ( DEBUG )
	{
		// Nothing
	}
	else
	{

		dataOnj = recordingData;
	}
	
	url = dataOnj[0]["name"];
	document.getElementById('site').src = url;
	document.getElementById('upperText').innerHTML = recordingName;
	
	maxTimeMin = new Date(dataOnj[dataOnj.length - 1]["time"]);
	minTimeMin = new Date(dataOnj[0]["time"]);
	maxTimeSec = new Date(dataOnj[dataOnj.length - 1]["time"]);
	minTimeSec = new Date(dataOnj[0]["time"]);
	
	var deltaMin = parseInt(maxTimeMin.getMinutes()) - parseInt(minTimeMin.getMinutes());
	var deltaSec = parseInt(maxTimeSec.getSeconds()) - parseInt(minTimeSec.getSeconds());
	deltaSec += deltaMin * 60;
	deltaPink = 100/deltaSec;
	totalDuration = deltaSec;
	
	var prevNormalizedTime = 0;
	var previosRelativePosition = 0;
	for( var i = 0; i < dataOnj.length; i++ )
	{
		var id = dataOnj[i]["id"];
		var params = dataOnj[i]["name"];
		
		var rawTime = new Date(dataOnj[i]["time"]);
		var timeMin = parseInt(rawTime.getMinutes()) - parseInt(minTimeMin.getMinutes());
		var timeSec = parseInt(rawTime.getSeconds()) - parseInt(minTimeSec.getSeconds());
		
		var normalizedTime = timeSec + timeMin * 60;
		
		if ( normalizedTime != prevNormalizedTime ) {
			var relativePosition = normalizedTime * deltaPink;
			setNewIcon(id, normalizedTime, relativePosition, previosRelativePosition);
			prevNormalizedTime = normalizedTime;
			previosRelativePosition = relativePosition;
		}
	}

	//document.getElementById(id).setAttribute("class", id);

	//clearInterval(thread);

	isPlaying = false;
	currentTime = 0;

}

function setNewIcon(id, normalizedTime, relativePosition, previosRelativePosition){
	if (id != "url"){
		document.getElementById("whiteWrapper").innerHTML += '<div id='+ id + normalizedTime +' class =iconClass > </div>';
		var d = document.getElementById(id + normalizedTime);
		d.className = d.className + " " + id;
		d.style.marginLeft = relativePosition - deltaPink / 2 - 0.8 + "%";
	}
}

function setNote(){
	var normalizedTime = Math.floor(currentTime * 10) / 10; 
	document.getElementById("grayWrapper").innerHTML += '<div id='+ 'note' + normalizedTime +' class =noteClass > </div>';
	var d = document.getElementById('note' + normalizedTime);
	d.className = d.className + " " + 'note';
	d.style.marginLeft = currentTime / totalDuration * 100 - 2.5 + "%";
	document.getElementById('noteTitle').value = "Title";
	document.getElementById('noteMessage').innerHTML = "Message";
}

function reset()
{
	playedEvents = new Array();
	currentTime = 0;
	clearInterval(thread);
	var movementDelta = deltaPink / 10;
	document.getElementsByClassName("timeLineCursor")[0].style.left = "-0.7%";	
	document.getElementsByClassName("timeLineBgPink")[0].style.width = "0%";	
}

function _setInterval(deltaSec)
{
	var movementDelta = deltaPink / 10;
	var tempLeft = document.getElementsByClassName("timeLineCursor")[0].style.left.split("%")[0];
	if ( tempLeft != "" )
	{
		tempLeft = parseFloat(tempLeft);
	}
	else
	{
		tempLeft = 0;
	}
	tempLeft += movementDelta;
	document.getElementsByClassName("timeLineCursor")[0].style.left = tempLeft + "%";	
	document.getElementsByClassName("timeLineBgPink")[0].style.width = tempLeft + "%";
	currentTime += 0.1;
	if (deltaSec <= currentTime)
	{
		clearInterval(thread);
	}
	
	// Check actions for given time
	for( var i = 1; i < dataOnj.length; i++ )
	{
		var rawTime = new Date(dataOnj[i]["time"]);
		var timeMin = parseInt(rawTime.getMinutes()) - parseInt(minTimeMin.getMinutes());
		var timeSec = parseInt(rawTime.getSeconds()) - parseInt(minTimeSec.getSeconds());
		var normalizedTime = timeSec + timeMin * 60;
		var id = dataOnj[i]["id"] + normalizedTime;
		
		var rawId = dataOnj[i]["id"];
		if ( rawId == "note" )
		{
			normalizedTime = parseFloat(dataOnj[i]["time"]);
			id = dataOnj[i]["id"] + normalizedTime;
		}
		
		var alreadyPlayed = false;
		
		for( var j = 0; j < playedEvents.length; j++ )	
		{
			if ( playedEvents[ j ] == id )
			{
				alreadyPlayed = true;
				break;
			}
		}
		
		if ( rawId != "note" && Math.ceil( currentTime ) == normalizedTime && alreadyPlayed == false )
		{
			playedEvents[playedEvents.length] = id; 			
			console.log( "playing event" + id );
			PlayEvent( dataOnj[i] );
			break;
		}
		else if ( rawId == "note" && Math.floor(currentTime * 10) / 10 == normalizedTime && alreadyPlayed == false )
		{
			playedEvents[playedEvents.length] = id; 			
			console.log( "playing event" + id );
			PlayEvent( dataOnj[i] );
			break;
		}
	}
}
	

function PlayEvent( data )
{
	var id = data["id"];
	
	// Hide last note
	document.getElementById('noteWindow').style.display='none';
	
	switch( id )
	{
		case "scroll":
			break;
		
		case "click_a":
			break;
			
		case "click_input_text":
			break;
		
		case "click_input_submit":
			break;
		
		case "rightclick":
			break;
		
		case "window.open":
			break;
		
		case "click_input_checkbox":
			break;
			
		case "note":
			var combined = data["name"];
			var title = combined.split(':')[0];
			var message = combined.split(':')[1];
			document.getElementById('noteTitle').value = title;
			document.getElementById('noteMessage').innerHTML = message;
			document.getElementById('noteWindow').style.display='block';
			break;
	}
}

function playButtonClick()
{
	var a = event.target;
	
	if ( isPlaying )
	{
		isPlaying = false;
		clearInterval(thread);
	}
	else
	{
		isPlaying = true;
		thread = setInterval(function(){_setInterval(totalDuration)}, 100);
	}

}

function restartButtonClick()
{
	var a = event.target;
	init();
}

function addNoteButtonClick()
{
	var a = event.target;
	
	if ( !isPlaying )
	{
		// Show note - only during pause
		document.getElementById('noteWindow').style.display='block';
	}
	
}


function noteButtonClose()
{
	document.getElementById('noteWindow').style.display='none';
	var canAdd = true;
	var index;
	
	// Check if eligble
	var previousTime = 0;
	
	for( var i = 0; i < dataOnj.length; i++ )
	{
		var rawTime = new Date(dataOnj[i]["time"]);
		var timeMin = parseInt(rawTime.getMinutes()) - parseInt(minTimeMin.getMinutes());
		var timeSec = parseInt(rawTime.getSeconds()) - parseInt(minTimeSec.getSeconds());
		var normalizedCurrentTime = Math.floor(currentTime * 10) / 10;			
		
		var normalizedTime = timeSec + timeMin * 60;
		if ( normalizedCurrentTime > previousTime && normalizedCurrentTime < normalizedTime )
		{
			index = i;
		}	
		
		previousTime = normalizedTime;
		
		if ( normalizedCurrentTime == normalizedTime )
		{
			canAdd = false;
		}

	}
	
	if ( canAdd )
	{
		var name;
		var title = document.getElementById('noteTitle').value;
		var message = document.getElementById('noteMessage').innerHTML;
		var noteData = {id: 'note', name: title + ':' + message, time: normalizedCurrentTime};
	
		// Insert into array
		dataOnj.splice(index, 0, noteData);
		setNote();
	}

}

window.onload = function()
{
	init();
}




