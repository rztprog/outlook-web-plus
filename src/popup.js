function updateCheckbox(id, storageKey) {
    const checkbox = document.getElementById(id);
    if (checkbox) {
        chrome.storage.local.get([storageKey], function (value) {
            if (value[storageKey] !== undefined) {
                checkbox.checked = value[storageKey];
                checkbox.addEventListener("input", function(e) {
                    chrome.storage.local.set({ [storageKey]: e.target.checked });
                });
            }
        });
    }
}

window.onload = function() {
    updateCheckbox("hideleftbannerInput", "hideleftbanner");
    updateCheckbox("hidepremiumadInput", "hidepremiumad");
    updateCheckbox("hidetopiconsInput", "hidetopicons");

    let manifestData = chrome.runtime.getManifest();

    document.getElementById("ext-version").textContent = "v" + manifestData.version;
};
