chrome.runtime.onMessage.addListener(function (message, sender) {
  chrome.tabs.query({ active: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function (response) {});
  });
});
