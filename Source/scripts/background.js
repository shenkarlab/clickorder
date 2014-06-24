
// Storage data name
var ExtensionDataName = "persistentData";

// Holds the application commands
var ExtensionData = {
  dataVersion: 6,
  appStatus: "stop",
  commands: [],
  recordingId: 0,
  recordings: []
};

var second = 1000;
var recordingTime = 0;

var timeInterval;
var commandsFeedbackInterval;


  /////////////
 // STORGAE //
/////////////

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
    ExtensionData.commands.push({id: id, name: value, time: currentTime});
    DB_save();  
  });
}

function saveRecording(data, startingUrl, captureUrl, recordingLength)
{
  var recordingName = "Recording " + ExtensionData.recordingId;
  var enteredName = prompt("Name Your Recording !", recordingName);

  if (enteredName != null) {
    recordingName = enteredName;
  }

  DB_load(function() {

    ExtensionData.recordings.push({id: ExtensionData.recordingId++,
                                   name: recordingName,
                                   startingUrl: startingUrl,
                                   capture: captureUrl,
                                   data: data,
                                   length: recordingLength,
                                   time: getCurrentDate()
                                 });

    DB_save(function() { clearData(); });  
  });
}

  ////////////
 // EVENTS //
////////////

window.onload = function()
{
  DB_load(ExtensionLoaded());
}

// Do stuff when extension had loaded
function ExtensionLoaded()
{
  setExtensionIcon();
}

function setExtensionIcon()
{
  var iconPath;
  var lastCommandIndex = ExtensionData.commands.length - 1;

  switch (ExtensionData.appStatus)
  {
    case "play":
      iconPath = getIconByCommand(ExtensionData.commands[lastCommandIndex].id);
      break;

    default:
      iconPath = "img/logo/logo48.png"
      break;
  }

  chrome.tabs.getSelected(null, function(tab) {
    // Change extension icon
    chrome.browserAction.setIcon({path: iconPath, tabId: tab.id});
  }); 
}

// Listen to special keys commands (e.g ALT+S)
chrome.commands.onCommand.addListener(function(command) 
{
	if (command == "screenshot")
	{
   	chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, 
      { format: "jpeg" , quality: 10 }, function(dataUrl) 
	  {
		  saveData("screenshot", dataUrl);
		});
  }
  else if (command == "startRecording") // ALT + R
  {
    startRecording();
  }
  else if (command == "stopRecording")  // ALT + S
  {
    // Load all data that has been 
    // saved during the recording
    DB_load(function() { stopRecording(); });
  }
  else if (command == "pauseRecording") // ALT + P
  {
    changeRecordingStatus("pause");
  }
});

// Listen to new tab opens
chrome.tabs.onCreated.addListener(function(tab) {
  saveData("newtab", "url: " + tab.url + " status: " + tab.status);
});

// //onUpdate tab state  - e.g: refresh, enter another address URL
 chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab) {

  // No change in the url means that it's a refresh
  if (changeInfo.url === undefined)
  {
    ExtensionLoaded();
  }
//   console.log(changeInfo.url.indexOf("chrome-extension://"));
//   console.log(changeInfo.url.indexOf("chrome://"));

//  // if((changeInfo.status == "complete") && !changeInfo.url.startWith("chrome-extension://") || !changeInfo.url.startWith("chrome://"))
//  //      saveData('refreshTab',"url: " + tab.url + " status: " + tab.status);

 });

// Listen for messages from content script
chrome.runtime.onConnect.addListener(function(port) {

  port.onMessage.addListener(function(msg) {

    if (msg.type == "load")
    {
      DB_load(function() { port.postMessage({type: "refreshData", data: ExtensionData}); });
    }
    else if (msg.type == "deleteRecording")
    {
      ExtensionData.recordings.splice(msg.index, 1);
      DB_save(function() { port.postMessage({type: "refreshData", data: ExtensionData}); }); 
    }
    else if (msg.type == "playRecording")
    {
      var recording = getRecordById(msg.index);
      startSimulation(recording.data, recording.startingUrl);
    }
    else if (msg.type == "stopRecording")
    {
      stopRecording();
      // Tell client to reset data
      port.postMessage({type: "initClient"});
    }
    else if (msg.type == "pauseRecording")
    {
      changeRecordingStatus("pause");
    }
    else if (msg.type == "startRecording")
    {
      startRecording();
    }
    else if (msg.type == "clearData")
    {
      clearData();
      port.postMessage({type: "initClient"}); 
    }
	else if (msg.type == "screenshot")
	{
		chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, 
		{ format: "jpeg" , quality: 10 }, function(dataUrl) 
		  {
			  saveData("screenshot", dataUrl);
		});
	}
	else if (msg.type == "showNote")
	{
		loadNoteDialogue();
	}
	else if (msg.type == "edit" )
	{
		var recording = getRecordById(msg.index);
		startEditing(recording.data, recording.startingUrl, msg.index);
	}
  });
});

function changeRecordingStatus(status)
{
  ExtensionData.appStatus = status;  

  if (status == "stop" || status == "pause")
  {
    clearInterval(timeInterval);
    clearInterval(commandsFeedbackInterval);
  }

  DB_save();
}

function startRecording()
{
  // Check that not already recording
  if (ExtensionData.appStatus == "play")
    return;

  changeRecordingStatus("play");

  timeInterval = 
    setInterval(function() {

      // Start counting recording time
      chrome.browserAction.setBadgeText({ text: recordingTime.toString() });
      recordingTime++;
      // Change icon according to last command made
      DB_load(setExtensionIcon());

    }, second);

  chrome.tabs.getSelected(null, function(tab) {
    // Save the tab url
    saveData("url", tab.url);
    // Reload tab to make sure the content
    // script will be injected
    chrome.tabs.reload(tab.id);
  });
}

function stopRecording()
{
  // Check that not already stopped
  if (ExtensionData.appStatus == "stop")
    return;

  changeRecordingStatus("stop");
  setExtensionIcon();
  processRecording();
}

function startSimulation(data, startingUrl)
{
  chrome.tabs.create({ url: startingUrl, active: false }, function(tab) 
  {    
    chrome.tabs.update(tab.id, { active: true });

    // Inject jquery 
    chrome.tabs.executeScript(tab.id, {file: "scripts/jquery-2.1.0.min.js"}, function() {
      // Inject script with array of commands as json  
      chrome.tabs.executeScript( tab.id, {code: "var commandsJson =" + JSON.stringify(data)}, function() {
        // Inject script with execution logic 
        chrome.tabs.executeScript(tab.id, {file: "scripts/executionScript.js"});
      });
    });

  }); 
}

function startEditing(data, startingUrl, name)
{
  chrome.tabs.create({ url: "Player.html", active: false }, function(tab) 
  {    
    chrome.tabs.update(tab.id, { active: true });

    // Inject jquery 
    chrome.tabs.executeScript(tab.id, {file: "scripts/jquery-2.1.0.min.js"}, function() {
    // Inject script with array of commands as json  
    chrome.tabs.executeScript( tab.id, {code: "var url =" + startingUrl});
	chrome.tabs.executeScript( tab.id, {code: "var recordingData =" + JSON.stringify(data)});
	chrome.tabs.executeScript( tab.id, {code: "var recordingName =" + name});
	chrome.tabs.executeScript(tab.id, {file: "scripts/executionScript.js"});
	});
	});
}

function resetTimeCounter()
{
  chrome.browserAction.setBadgeText({text: ""});
  recordingTime = 0;
}

function clearData()
{
  DB_clear(function() 
  { 
    changeRecordingStatus("stop");
    resetTimeCounter();
    ExtensionData.commands = []; 
  });
}

// Process the recording before saving
function processRecording()
{
  // We have something to save ?
  if (ExtensionData.commands.length < 2)
    return;

  // The starting url of the recording
  var startingUrl = "";

  for (var i = 0; i < ExtensionData.commands.length; i++)
  {
    if (ExtensionData.commands[i].id == "url")
    {
      startingUrl = ExtensionData.commands[i].name;
      break;
    }
  }

  // Format the recording time 
  var recordingLength = formatRecordingLength();

  // Capture an image for the recording
  // to be display at the GUI
  chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, 
    { format: "jpeg" , quality: 8 }, function(captureUrl) 
  {
    saveRecording(ExtensionData.commands ,startingUrl, captureUrl, recordingLength);
  });
}


 function unloadNoteDialogue() 
 {    
	 $('#noteWindow').fadeOut("slow");
 }    
 
 function loadNoteDialogue() 
 {    
	$('#noteWindow').fadeIn("slow");  
 }  
