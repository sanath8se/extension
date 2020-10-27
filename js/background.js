chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
  
        console.log("couldn't find word2");
        chrome.tabs.query({
          "active": true,
          "currentWindow": true
      }, function (tabs) {
          console.log("couldn't find word3");
          chrome.tabs.sendMessage(tabId, {
              "wordToHighlight": "permanent responsible"},function(response) {
                }
          );
      });
  
    }
  })