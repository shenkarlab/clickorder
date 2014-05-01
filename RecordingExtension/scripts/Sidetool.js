
// Storage data name
var ExtensionDataName = "persistentData";

// Holds the application commands
var ExtensionData = {
  dataVersion: 3,
  isRecording: false,
  commands: []
};

var playImage = "img/play.png";
var stopImage = "img/stop.png";

  ////////////
 // EVENTS //
////////////

$("document").ready(function() 
{
      ////////////////////
     // BUTTON EVENTS ///
    ////////////////////
    $( "#mybutton" ).click(function() {
          alert( "Handler for .click() called." );
        });

    $( "#clearBtn" ).click(function() {
        clearCommands();
    });

    $( "#recordingBtn" ).click(function() {
        recordingButtonPressed();
    });

    // Init list after sotrage load callback
    DB_load(function() 
    {
        changeRecordingButtonImage();

        if (ExtensionData.isRecording)
        {
            var list = document.getElementById('photosList');

            // Append loaded commands to list
            for (var i = 0; i < ExtensionData.commands.length; i++) 
            {
                var entry = document.createElement('li');
                var br = document.createElement('br');

                entry.appendChild(getImageElement(ExtensionData.commands[i].id));
                entry.appendChild(br);
                entry.appendChild(boldHTML("Type: "));
                entry.appendChild(document.createTextNode(ExtensionData.commands[i].id + " "));
                br = document.createElement('br');
                entry.appendChild(br);
                entry.appendChild(boldHTML("Data: "));
                entry.appendChild(document.createTextNode(ExtensionData.commands[i].name));              

                list.appendChild(entry);
            } 

            // Add seperating line after every list item
            jQuery("ul li").append("<hr size='3' style='color:#333;background-color:#333;' />");
        }
        else
        {
            // commands saved while not recording
            // have no importance
            if (ExtensionData.commands.length > 0)
            {
                clearCommands();
            }
        }
  });
});

function boldHTML(text) {
  var element = document.createElement("b");
  element.innerHTML = text;
  return element;
}

function getImageElement(commantId)
{
    var img = document.createElement("img");
    

    switch(commantId)
    {
        case "screenshot": 
            img.src = "img/screenshot.png";
            break;

        case "click":
            img.src = "img/click.png";
            break;

        case "keyboard":
            img.src = "img/keyboard.png";
            break;

        case "newtab":
            img.src = "img/newtab.png";
            break;

        case "scroll":
            img.src = "img/scroll.png";
            break;
    }

    img.width = 30;
    img.height = 30;

    return img;
}

function clearCommands()
{
    // Clear persistent data
    DB_clear();
    // Clear cached array
    ExtensionData.commands = [];
    // Refresh page
    history.go(0);
}

function recordingButtonPressed()
{
    ExtensionData.isRecording = !ExtensionData.isRecording;
    changeRecordingButtonImage();

    DB_save(function() {
        if (!ExtensionData.isRecording)
        {
            exportCommands();
            clearCommands();
        }
    });
}

function changeRecordingButtonImage()
{
    if (ExtensionData.isRecording)
    {
        $("#recordingBtn").attr("src", stopImage);
    }
    else
    {
        $("#recordingBtn").attr("src", playImage);   
    }
}

function exportCommands()
{
    var message = "Actions Summary:\n------------------\n\n";

    for (var i = 0; i < ExtensionData.commands.length; i++) 
    {
        message += ("#" + (i + 1) + " ");
        message += ("Type: " + ExtensionData.commands[i].id + "\n");
        message += ("Data: " + ExtensionData.commands[i].name + "\n\n");
    }

    alert(message);
}