chrome.action.onClicked.addListener(function (tab) {
    chrome.tabs.create({'url': chrome.runtime.getURL('settings/settings.html')}, function (tab) {});
});