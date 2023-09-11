// popup.js - JavaScript for the popup UI
document.addEventListener("DOMContentLoaded", async function () {
  // Get references to HTML elements
  const startRecordingButton = document.getElementById("startRecording");
  const stopRecordingButton = document.getElementById("stopRecording");
  const transcriptDiv = document.getElementById("transcript");
  let tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  // Add click event listeners to the buttons
  startRecordingButton.addEventListener("click", function () {
    // Send a message to the background script to start recording
    chrome.runtime.sendMessage({ action: "startRecording", tabId: tabs?.[0]?.id }, function (response) {
      console.log("Recording started:", response);
    });
  });

  stopRecordingButton.addEventListener("click", function () {
    // Send a message to the background script to stop recording
    chrome.runtime.sendMessage({ action: "stopRecording", tabId: tabs?.[0]?.id }, function (response) {
      console.log("Recording stopped:", response);
    });
  });
});
