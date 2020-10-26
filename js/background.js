
console.log("couldn't find word1");
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
  
        console.log("couldn't find word2");
        chrome.tabs.query({
          "active": true,
          "currentWindow": true
      }, function (tabs) {
          console.log("couldn't find word3");
          chrome.tabs.sendMessage(tabs[0].id, {
              "wordToHighlight": "google"},function(response) {
                }
          );
      });
  
    }
  })