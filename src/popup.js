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

    let manifestData = chrome.runtime.getManifest();
    document.querySelector(".extVersion").textContent = `v${manifestData.version}`;
};
