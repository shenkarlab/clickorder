// Listen to mouse clicks and save 
// it in our local storage.
// Loads storage handling functions

// Events currently saved: 
// ----------------------
// * mouse clicks 
// * keyboard types
// * scrolling
// * Alt + S takes a photo
// * new tab opens
// ----------------------

  /////////////
 // STORAGE //
/////////////

var eventCount = 0;
var eventProperty = [];

var ExtensionDataName = "persistentData";

// Holds the application commands
var ExtensionData = {
  dataVersion: 6,
  appStatus: "stop",
  commands: [],
  recordingId: 0,
  recordings: []
};

// For handling typing into text fields
var InputData = {
  // Indicates that we are in a text box
  // to save upcoming keyboard commands
  isInInputField: false,
  // Holds the id or class of the 
  // text box that the user is typing into
  identification: "",
  // Saves the text entered
  text: ""
};



function DB_load(callback) {
    chrome.storage.local.get(ExtensionDataName, function(r) {
        if (isEmpty(r[ExtensionDataName])) {
            DB_setValue(ExtensionDataName, ExtensionData, callback);
        } else if (r[ExtensionDataName].dataVersion != ExtensionData.dataVersion) {
            DB_setValue(ExtensionDataName, ExtensionData, callback);
        } else {
            ExtensionData = r[ExtensionDataName];
            callback();
        }
    });
}

function DB_clear(callback) {
    chrome.storage.local.remove(ExtensionDataName, function() {
        if(callback) callback();
    });
}

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

function DB_setValue(name, value, callback) {
    var obj = {};
    obj[name] = value;
    //alert("Data Saved!");
    chrome.storage.local.set(obj, function() {
        if(callback) callback();
    });
}

function DB_save(callback) {
    DB_setValue(ExtensionDataName, ExtensionData, function() {
        if(callback) callback();
    });
}

function saveData(id, value)
{
    var currentTime = new Date().getTime();

    DB_load(function() {

        if (ExtensionData.appStatus == "play")
        {
            ExtensionData.commands.push({id: id, name: value, time: currentTime});
            DB_save();
        }  
    });
}

  ////////////
 // EVENTS //
////////////

DB_load(function() 
{ 
    $('a').click(function (event){ 
        var link = $(this);
        var target = link.attr("target");
        var href = link.attr("href");
        var action = "";

        if($.trim(target).length > 0)
        {
            action = "window.open('" + href + "'), " + target + ")";
        }
        else
        {
            action = "window.location = '" + href + "'";
        }

        saveData("click_a", action);
    });

    $('input').click(function (event) { 

        var prefix = "#";
        var identification = $(this).attr('id');
        var type = $(this).attr('type');

        if (identification == undefined)
        {
            prefix = ".";
            identification = $(this).attr('class');
        }
        if (identification != undefined)
        {
            if (type == "submit")
            {
                saveData("click_input_submit", prefix + identification);
            }
            else if (type == "checkbox")
            {
                saveData("click_input_checkbox", prefix + identification);
            }
            else
            {
                InputData.isInInputField = true;
                InputData.identification = prefix + identification;

                saveData("click_input_text", prefix + identification);
            }
        }
    });

    $('input').focusout(function() {
        if (InputData.isInInputField)
        {
            // Left the input field
            InputData.isInInputField = false;
            // Saved the string typed in the field
            saveTypedString();
        }
        //saveData("focusout", "");
    }); 

    /*$('div').click(function (event){ 

        var prefix = "#";
        var identification = $(this).attr('id');

        if (identification == undefined)
        {
            prefix = ".";
            identification = $(this).attr('class');
        }
        if (identification != undefined)
        {
            saveData("click", prefix + identification);
        }
    });*/

    // Listen to keyboard events
    document.onkeyup = keyPressed;
    
    // Listen to right click events
    document.addEventListener('contextmenu',rightClickEvent); 
    
    // Listens to scroll stops events
    $(window)
      /*.on("scrollstart", function() {
        // Paint the world yellow when scrolling starts.
        $(document.body).css({background: "yellow"});
      })*/
      .on("scrollstop", function() {
        // Paint it all green when scrolling stops.
        scrollFunction();
      })
	  
	  // Close note event
	    $("#btnCloseNote").click(function (event){ 
			// TODO: save data from the note dialogue
		});

});


function scrollFunction() {
    saveData("scroll", window.pageXOffset + "," + window.pageYOffset);
}

function rightClickEvent(mouseEvent) {
    saveData("rightclick","X: " + mouseEvent.x + ", Y: " + mouseEvent.y);
}

function keyPressed(e) {
    var key = ( window.event ) ? event.keyCode : e.keyCode;
    // Format the key code to the actual char
    var character = String.fromCharCode(key);

    InputData.text += character;

    // When we are not in the text box 
    // anymore, save the string  written
    if (!InputData.isInInputField)
    {
        saveTypedString();
    }
}

function saveTypedString()
{
    if (InputData.text != "" && InputData.identification != "")
    {
        saveData("keyboard", "$('" + InputData.identification + "').val('" + InputData.text + "')");
        InputData.text = "";
        InputData.identification = "";
    }
}