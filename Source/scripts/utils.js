
function getIconByCommand(commandId)
{
    var directory = "img/19px/";
    var imgPath;

    switch(commandId)
    {
    	case "url":
    		imgPath = "img/internet.png";
    		break;

        case "screenshot": 
            imgPath = directory + "screenshot.png";
            break;

        case "click":
        case "click_a":
        case "click_input_text":
        case "click_input_submit":
            imgPath = directory + "click.png";
            break;

        case "rightclick":
            imgPath = directory + "rightclick.png"
            break;

        case "keyboard":
            imgPath = directory + "keyboard.png";
            break;

        case "newtab":
            imgPath = directory + "newtab.png";
            break;

        case "scroll":
            imgPath = directory + "scroll.png";
            break;

        case "refreshTab":
            imgPath = "img/refresh.png";
            break;

        case "newURLSearch":
            imgPath = "img/NewURLSearch.png";
            break;

    }

    return imgPath;
}

function getListNameByEvent(commandId)
{
    switch(commandId)
    {
        case "screenshot": 
            return "photosEventsList";

        case "click":
            return "mouseEventsList";

        case "keyboard":
            return "keyboardEventsList";

        case "newtab":
            return "mouseEventsList";

        case "scroll":
            return "mouseEventsList";
    }
}

function changeButtonBackground(element)
{
    $("#playBtn").css('background-color', '#051D3F');
    $("#stopBtn").css('background-color', '#051D3F');
    $("#pauseBtn").css('background-color', '#051D3F');

    $("#" + element).css('background-color', '#0C4B90');
}

// Converts a given text to an html 
// bold text element 
function boldHTML(text) 
{
    var element = document.createElement("b");
    element.innerHTML = text;
    return element;
}

// Used for debugging, export all commands
// and write to console log
function exportCommands()
{
    var message = "Actions Summary:\n------------------\n\n";

    for (var i = 0; i < ExtensionData.commands.length; i++) 
    {
        message += ("#" + (i + 1) + " ");
        message += ("Type: " + ExtensionData.commands[i].id + "\n");
        message += ("Data: " + ExtensionData.commands[i].name + "\n");
        message += ("Time: " + new Date(ExtensionData.commands[i].time).getUTCFullYear() + "\n\n");
    }

    console.log(message);
}

function getCurrentDate()
{
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) {
      dd='0'+dd
  } 

  if(mm<10) {
      mm='0'+mm
  } 

  return mm+'/'+dd+'/'+yyyy;
}

function formatRecordingLength()
{
  var minutes = Math.floor(recordingTime / 60);
  var seconds = recordingTime - (minutes * 60); 
  
  if(minutes<10) {
      minutes='0'+minutes
  } 

  if(seconds<10) {
      seconds='0'+seconds
  }

  return minutes + ":" + seconds;
}

function getRecordById(id)
{
  for (var i = 0; i < ExtensionData.recordings.length; i++)
  {
    var record = ExtensionData.recordings[i];

    if (record.id == id)
    {
      return record;
    }
  }
}