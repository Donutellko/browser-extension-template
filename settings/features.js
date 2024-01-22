console.log("Started features.js");

FEATURES_KEY = "FEATURES"

const defaultFeatures = {
    JIRA: {
        header: "Jira",
        features: {
            FEATURE_AUTOLOGIN: {
                description: 'Automatically fill username and password and press Login button.',
                enabled: true,
                settings: {
                    FEATURE_AUTOLOGIN_REMEMBER_ME: {
                        description: "Should check 'remember me'? {true,false}",
                        value: "true"
                    },
                }
            }
        }
    },
}
const resetDataButton = document.getElementById('reset-data')
resetDataButton.onclick = () => {
    chrome.storage.local.clear(function () {
        console.log("All data reset.");
    });
}

const resetFeaturesButton = document.getElementById('reset-features')
resetFeaturesButton.onclick = () => {
    features = getDefaultFeatures()
    displayFeatureToggle(features)

    saveSettings(features)
}

const refreshServiceOccupationButton = document.getElementById('refresh-service-occupation')
refreshServiceOccupationButton.onclick = () => {
    SERVICE_OCCUPATION_TICKETS_KEY = 'SERVICE_OCCUPATION_TICKETS_KEY'
    chrome.storage.local.set({SERVICE_OCCUPATION_TICKETS_KEY: null}, () => {
        console.log("Purged service occupation tickets");
    })
}

function getDefaultFeatures() {
    return JSON.parse(JSON.stringify(defaultFeatures))
}

let features = getDefaultFeatures()

chrome.storage.local.get(null, (val) => {
    let savedFeatures = val[FEATURES_KEY]
    console.log(savedFeatures);

    if (savedFeatures) {
        applySettings(features, savedFeatures)
    }
    saveSettings(features)

    displayFeatureToggle(features)
})

// `to` is current settings model, `from` is saved settings values
function applySettings(to, from) {
    for (let systemName of Object.keys(from)) {
        let toSystem = to[systemName]
        let fromSystem = from[systemName]

        if (!toSystem) continue

        for (let featureName of Object.keys(fromSystem.features)) {
            let toFeature = toSystem.features[featureName]
            let fromFeature = fromSystem.features[featureName]

            if (toFeature) {
                toFeature.enabled = fromFeature.enabled
            }
            if (fromFeature.settings) {
                for (let settingKey in fromFeature.settings) {
                    fromSetting = fromFeature.settings[settingKey]
                    toSetting = toFeature.settings[settingKey]
                    if (toSetting) {
                        toSetting.value = fromSetting.value
                    }
                }
            }
        }
    }
}

function saveSettings(features) {
    chrome.storage.local.set({FEATURES: features}, () => {
        console.log("Settings saved");
    })
}

function displayFeatureToggle(features) {
    let featureContainer = document.getElementById('feature-toggles')
    let ftContainer = document.createElement("div")
    for (let systemId in features) {
        ftContainer.append(buildSystemFeatures(systemId, features[systemId]))
    }
    featureContainer.innerHTML = ''
    featureContainer.append(ftContainer)
}

function buildSystemFeatures(systemId, systemFeatures) {
    let header = systemFeatures.header
    let features = systemFeatures.features

    let div = document.createElement('div')
    let h2 = document.createElement('h2')
    h2.innerText = header
    div.append(h2)

    for (let fId in features) {
        let feature = features[fId]
        div.append(createFeatureToggleCheckbox(systemId, fId, feature.description, feature.enabled))
        if (feature.settings) {
            for(let settingId in feature.settings)
            div.append(createFeatureToggleSetting(systemId, fId, settingId))
        }
    }
    return div;
}

function createFeatureToggleCheckbox(systemId, featureId, description, enabled) {
    let checkbox = document.createElement('input')
    let systemFeatures = features[systemId]
    let feature = systemFeatures.features[featureId]
    checkbox.type = 'checkbox'
    checkbox.id = featureId
    checkbox.checked = enabled;
    checkbox.onchange = () => {
        feature.enabled = checkbox.checked
        saveSettings(features)
    }

    let label = document.createElement('label')
    label.for = checkbox.id
    label.innerText = description

    let container = document.createElement('div')
    container.style.marginTop = "10pt"
    container.append(checkbox, label)
    return container
}

function createFeatureToggleSetting(systemId, featureId, settingId) {
    let input = document.createElement('input')
    let systemFeatures = features[systemId]
    let feature = systemFeatures.features[featureId]
    let setting = feature.settings[settingId]
    input.id = settingId
    input.value = setting.value;
    input.style.minWidth = "300pt"
    input.style.marginTop = "5pt"
    input.style.marginLeft = "10pt"

    let label = document.createElement('label')
    label.for = input.id
    label.innerText = setting.description
    label.style.display = "inline-block"
    label.style.minWidth = "400pt"

    let button = document.createElement("button")
    button.innerText = "Save"
    button.onclick = () => {
        setting.value = input.value
        saveSettings(features)
    }

    let container = document.createElement('div')
    container.append(label, input, button)
    return container
}
