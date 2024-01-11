const colorChecker = (ms = 100) => {
    const findColorInput = () => {
        const textInput = document.getElementById("numberofemailcolorInput");
        const colorInput = document.querySelector(".numberofemailtypecolorInput");

        if (textInput) {
            textInput.addEventListener("input", function (event) {
                chrome.storage.local.set({ numberOfEmailColor: event.target.value });
                colorInput.style.backgroundColor = event.target.value;
            });
        
            textInput.addEventListener("change", function (event) {
                chrome.storage.local.set({ numberOfEmailColor: event.target.value });
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

                inputElement.addEventListener("input", function (e) {
                    const newValue = inputElement.type === 'checkbox' ? e.target.checked : e.target.value;
                    chrome.storage.local.set({ [storageKey]: newValue });
                });
            }
        });
    }
}

window.onload = function() {
    // Updater
    updateInputElement("hideleftbannerInput", "hideLeftRail");
    updateInputElement("hidepremiumadInput", "hidePremiumAd");
    updateInputElement("hidetopiconsInput", "hideTopIcons");
    colorChecker();
    updateInputElement("addpremiumlogoInput", "premiumLogo");
    updateInputElement("addnumberofemailInput", "addNumberOfEmail");
    updateInputElement("numberofemailcolorInput", "numberOfEmailColor");
    updateInputElement("numberofemailtypecolorInput", "numberOfEmailColor");
    updateInputElement("addcheckallbuttonInput", "checkAllVisible");
    updateInputElement("addaligntitlefolderInput", "alignTitle");
    updateInputElement("addcustomBackgroundInput", "addcustomBackground");
    updateInputElement("customBackgroundInput", "customBackground");

    // Locales
    document.getElementById("ads_title_text").textContent = chrome.i18n.getMessage("ads_text");
    document.getElementById("hide_left_rail_text").textContent = chrome.i18n.getMessage("cfg_hide_left_rail");
    document.getElementById("hide_premium_ad_text").textContent = chrome.i18n.getMessage("cfg_hide_premium_ad");
    document.getElementById("hide_top_icons_text").textContent = chrome.i18n.getMessage("cfg_hide_top_icons");
    document.getElementById("extras_title_text").textContent = chrome.i18n.getMessage("extras_text");
    document.getElementById("outlook_logo_text").textContent = chrome.i18n.getMessage("cfg_outlook_logo");
    document.getElementById("email_counter_text").textContent = chrome.i18n.getMessage("cfg_email_counter");
    document.getElementById("check_all_emails_text").textContent = chrome.i18n.getMessage("cfg_check_all_emails_button");
    document.getElementById("align_title_text").textContent = chrome.i18n.getMessage("cfg_align_title_folder");
    document.getElementById("custom_background_text").textContent = chrome.i18n.getMessage("cfg_custom_background");

    let manifestData = chrome.runtime.getManifest();
    document.querySelector(".extVersion").textContent = `v${manifestData.version}`;
};
