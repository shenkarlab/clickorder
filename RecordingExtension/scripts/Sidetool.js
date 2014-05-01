
// Storage data name
var ExtensionDataName = "persistentData";

// Holds the application commands
var ExtensionData = {
  dataVersion: 3, //if you want to set a new default data, you must update "dataVersion".
  commands: []
};

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

    // Load data on page load
    DB_load(function() 
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