function setIcon(tab) {
   const url = new URL(tab.url);
   const iconName = url.protocol === "https:" ? "green-128.png" : "red-128.png";
 
   chrome.browserAction.setIcon({
     path: iconName,
     tabId: tab.id
   });
 }
 
 chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
   if (changeInfo.status === "complete") {
     setIcon(tab);
   }
 });
 
 chrome.tabs.onActivated.addListener((activeInfo) => {
   chrome.tabs.get(activeInfo.tabId, (tab) => {
     setIcon(tab);
   });
 });
 