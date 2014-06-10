// This script is injected when
// playing a recording.
// It gets an array of commands as json
// from background.js and convert
// the array to executable commands


// Will hold the commands fetched  
// from the sent json
var commands = [];

// Script loaded
$("document").ready(function() {

    // commandsJson is passed from background.js,
    // It containes all users commands of the recording
    for (var i in commandsJson)
    {
        commands.push(commandsJson [i]);
    }

    // Sort by creation time beacuse  
    // commands saving is done async
    commands.sort(function(a, b) {return a.time - b.time});

	// Trigger execution
	process_action(1);

});

// Starts the execution of the commands
// with consideration of timing delay
function process_action(i) {

    // Convert to executable command
    eval(convertToCommand(commands[i]));

    // Simulate delay between commands
    if (i < commands.length - 1) {
        setTimeout(function() {
            process_action(i + 1);
        }, commands[i + 1].time - commands[i].time);
    }
    else
    {
        alert("Simulation Finished");
    }
}

// Convers a saved command object
// to an executable command
function convertToCommand(command)
{
    var action= "";
    console.log(command.id + " time: " + command.time);

    switch(command.id)
    {
        case "click":
        case "click_input_submit":
            action = "$('" + command.name + "').trigger('click')";
            break;

        case "click_a":    
            action = command.name;
            break;

        case "click_input_text":
            action = "$('" + command.name + "').focus()"; 
            break;

        case "click_input_checkbox":
            action = "$('" + command.name + "').prop('checked', true)"; 
            break;

        case "scroll":
            var coords = command.name.split(",");
            action = "window.scrollTo(" + coords[0] + "," + coords[1] + ")";
            break;

        case "keyboard":
            action = command.name;
            break;

        case "screenshot":
            action = "window.open('" + command.name + "')";
            break;
    }

    console.log(action);
    return action;
}
