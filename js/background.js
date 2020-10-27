chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        chrome.tabs.query({
          "active": true,
          "currentWindow": true
      }, function (tabs) {
          chrome.tabs.sendMessage(tabId, {
              "wordToHighlight": "permanent responsible liable"},function(response) {
                }
          );
      });
  
    }
  })