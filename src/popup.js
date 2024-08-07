function scrapeAddonVersion(actualVersion, translatedMessage) {
    fetch('https://addons.mozilla.org/api/v5/addons/search/?app=firefox&appversion=123.0&author=17444166&page=1&type=extension')
    .then(response => response.json()) 
    .then(data => {
        const addonData = data.results[0]['current_version']
        const newVersion = addonData['version']
        const newVersionUrl = addonData['file']['url']
        const divNewVersion = document.querySelector('.linkNewVersion');

        if (newVersion !== actualVersion) {
            divNewVersion.style.display = 'flex'
            divNewVersion.href = navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ? newVersionUrl : 'https://chromewebstore.google.com/detail/outlook-web-plus/jgomcpcjiffhcbmodgkekfenhhmjphpn'
            document.querySelector('.newVersion').textContent = `🔔 ${translatedMessage} v${newVersion}`
        } else {
            divNewVersion.style.display = 'none'
        }
    })
    .catch(error => {
        console.error('Version not found : ', error);
    });
}

const colorChecker = (ms = 100) => {
    const findColorInput = () => {
        const textInput = document.getElementById('emailcalculatorcolorInput');
        const colorInput = document.getElementById('emailcalculatorcolortypeInput');

        if (textInput) {
            textInput.addEventListener('input', function (event) {
                chrome.storage.local.set({ emailCalculatorColor: event.target.value });
                colorInput.style.backgroundColor = event.target.value;
            });
        
            textInput.addEventListener('change', function (event) {
                chrome.storage.local.set({ emailCalculatorColor: event.target.value });
                colorInput.style.backgroundColor = event.target.value;
            });

            colorInput.style.backgroundColor = textInput.value;
            clearInterval(timer);
        }
    }
    const timer = setInterval(findColorInput, ms);
}

const updateInputElement = (id, storageKey) => {
    const inputElement = document.getElementById(id);

    if (inputElement) {
        chrome.storage.local.get([storageKey], function (value) {
            if (value[storageKey] !== undefined) {
                if (inputElement.type === 'checkbox') {
                    inputElement.checked = value[storageKey];
                } else {
                    inputElement.value = value[storageKey];
                }

                inputElement.addEventListener('input', function (e) {
                    const newValue = inputElement.type === 'checkbox' ? e.target.checked : e.target.value;
                    chrome.storage.local.set({ [storageKey]: newValue });
                });
            }
        });
    }
}

window.onload = function() {
    // Updaters
    updateInputElement('hideleftbannerInput', 'hideLeftRail');
    updateInputElement('hidetopiconsInput', 'hideTopIcons');
    updateInputElement('hidefirstemailadInput', 'hideFirstemailAd');                        
    colorChecker();
    updateInputElement('addemailcalculatorInput', 'addEmailCalculator');
    updateInputElement('emailcalculatorcolorInput', 'emailCalculatorColor');
    updateInputElement('emailcalculatorcolortypeInput', 'emailCalculatorColor');
    updateInputElement('addaligntitlefolderInput', 'alignTitle');
    updateInputElement('addcustomBackgroundInput', 'addcustomBackground');
    updateInputElement('customBackgroundInput', 'customBackground');
    updateInputElement('addtransparencytobarInput', 'topbarTransparency');
    updateInputElement('addsupportandratebuttonInput', 'supportAndRateButton');

    // Locales
    document.getElementById('ads_title_text').textContent = chrome.i18n.getMessage('ads_text');
    document.getElementById('hide_left_rail_text').textContent = chrome.i18n.getMessage('cfg_hide_left_rail');
    document.getElementById('hide_top_icons_text').textContent = chrome.i18n.getMessage('cfg_hide_top_icons');
    document.getElementById('extras_title_text').textContent = chrome.i18n.getMessage('extras_text');
    document.getElementById('email_counter_text').textContent = chrome.i18n.getMessage('cfg_email_counter');
    document.getElementById('align_title_text').textContent = chrome.i18n.getMessage('cfg_align_title_folder');
    document.getElementById('custom_background_text').textContent = chrome.i18n.getMessage('cfg_custom_background');
    document.getElementById('transparency_topbar_text').textContent = chrome.i18n.getMessage('cfg_transparency_topbar');
    document.getElementById('support_rate_topbar_text').textContent = chrome.i18n.getMessage('cfg_support_rate_topbar');
    document.getElementById('topButtonsCalendar_text').textContent = chrome.i18n.getMessage('cfg_open_calendar');
    document.getElementById('topButtonsOutlook_text').textContent = chrome.i18n.getMessage('cfg_open_outlook');
    document.getElementById('hide_firstemail_ad_text').textContent = chrome.i18n.getMessage('cfg_hide_firstemail_ad');

    // Version
    let manifestData = chrome.runtime.getManifest();
    document.querySelector('.extVersion').textContent = `v${manifestData.version}`;

    scrapeAddonVersion(manifestData.version, chrome.i18n.getMessage('cfg_new_version'));
    setInterval(() => {
        scrapeAddonVersion(manifestData.version, chrome.i18n.getMessage('cfg_new_version'));
    }, 12 * 60 * 60 * 1000); // Check every 12 hours if a new version is available if browser is already open

    // Rating
    const firefoxLink = 'https://addons.mozilla.org/fr/firefox/addon/outlook-web-plus';
	const chromeLink = 'https://chromewebstore.google.com/detail/outlook-web-plus/jgomcpcjiffhcbmodgkekfenhhmjphpn';
    document.querySelector('.rating').href = (navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ? firefoxLink : chromeLink) + '/reviews';
};
