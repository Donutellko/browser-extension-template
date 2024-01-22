# How to install?

* Clone this repository or download it as an archive and extract its contents.  
* Open your Chrome (or Chromium-based) browser, go to Extensions (`chrome://extensions/`).   
* Toggle `Developer mode` in the top right corner.   
* Click `Load unpacked` and select the folder that that contains the `manifest.json` file.
* Enjoy!

To update, simply pull or download the folder again to the same location. 
Then go to Extensions (`chrome://extensions/`) and hit the Update button on the card.  
Alternatively, you can locate the extension icon in the top right corner of your browser, right-click on it, then `Manage extension` and hit Update in the top left corner.

# What does it do?

## Jira
* Perform autologin in Jira.


## Manage features in settings
You can disable any feature mentioned in this page. 
To do so, click on the extension logo in the top right corner with left button, or with right button, and then `Options`.  

# Contribution

In order to add a new script:  
* Create a `.js` file in the appropriate folder. 
* In `manifest.json` add your new file and specify the URL for it. Increment the `version`.  
* Add your feature into `settings/features.js`, come up with unique id for your feature starting with `FEATURE_` and describe in 
  one sentence what it does.
* Copy general structure from another file, preferably the newest one: 
  * `console.log` - change the file path;
  * `(function() {` and constants - update constants and replace `FEATURE_` constant;
  * `isFeatureEnabled()` - leave unchanged;
* implement `myMainFunction` or write your code in this block right away:
  ```js
  chrome.storage.local.get(null, (storage) => {
    if (isFeatureEnabled(storage, FEATURE_YOUR_FEATURE)) {
      myMainFunction(storage)
    }
  })
  ```
* To update the code in the browser as you write it, click Update in `chrome://extensions/`. If `Reloading...` message doesn't 
  disappear, try turning the extension off and on again.
* Add small description of the feature to README, including the Changelog section. 
  If you want to add a screenshot, make sure its width is 720px.
* If you have any problems, don't hesitate asking me (`@Donat Shergalis`)
* Open a PR with your changes and notify me in MS Teams to review and merge it.
* You're fantastic!
