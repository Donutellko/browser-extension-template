console.log("Started example/jira_autologin extension");

(function() {
const FEATURES_KEY = 'FEATURES'
const SYSTEM_KEY = 'JIRA'


const FEATURE_AUTOLOGIN = 'FEATURE_AUTOLOGIN'
const JIRA_CREDENTIALS_KEY = 'JIRA_CREDENTIALS_KEY'
const FEATURE_AUTOLOGIN_REMEMBER_ME = 'FEATURE_AUTOLOGIN_REMEMBER_ME'

let storage = null

function getFeature(featureId) {
    let allFeatures = storage[FEATURES_KEY] || {}
    let systemInfo = allFeatures[SYSTEM_KEY] || {}
    let systemFeatures = systemInfo.features || {}
    let featureInfo = systemFeatures[featureId] || {}

    return featureInfo
}

// Check if feature is enabled in settings.js
function isFeatureEnabled(featureId) {
    let featureInfo = getFeature(featureId)
    return featureInfo.enabled !== false
}

function getSetting(featureId, settingId) {
    let featureInfo = getFeature(featureId)
    let settings = featureInfo.settings || {}
    return settings[settingId] || {}
}

function getSettingValue(featureId, settingId) {
    let setting = getSetting(featureId, settingId) || {}
    return setting.value
}

// Your code starts here:

chrome.storage.local.get(null, (fetchedStorage) => {
    storage = fetchedStorage;
    if (isFeatureEnabled(FEATURE_AUTOLOGIN)) {
        performAutologin(storage);
    }
})

function performAutologin(storage) {
    let loginButton = document.querySelector("#login-form-submit")
    let usernameField = document.querySelector("#login-form-username")
    let passwordField = document.querySelector("#login-form-password")
    let rememberMeCheckbox = document.querySelector("#login-form-remember-me")
    let errorText = document.querySelector(".aui-message-error") // if login failed

    // Use feature settings from settings.js
    if (getSettingValue(FEATURE_AUTOLOGIN, FEATURE_AUTOLOGIN_REMEMBER_ME) == 'true') {
        rememberMeCheckbox.checked = true
    }

    // Use extension storage directly to store parameters
    let savedCredentials = storage[JIRA_CREDENTIALS_KEY] || {}
    // use saved credentials if login not failed, use errorText to avoid retries if credentials changed
    if (savedCredentials.username && savedCredentials.password && !errorText) {
        console.log("Username and password are filled. Performing autologin.");
        usernameField.value = savedCredentials.username
        passwordField.value = savedCredentials.password
        loginButton.click()
        loginButton.style.backgroundColor = 'lightgrey'
    } else { // save credentials on click
        loginButton.onclick = () => {
            savedCredentials.password = passwordField.value
            savedCredentials.username = usernameField.value

            chrome.storage.local.set({JIRA_CREDENTIALS_KEY: savedCredentials}, () => {
                console.log('New credentials saved!');
            })
        }
    }
}

})();