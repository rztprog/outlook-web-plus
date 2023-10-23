'use strict';
const greenColor = "#498205";
let startTimer = null;

let hideleftbanner = true;
let hidepremiumad = true;
let hidetopicons = true;
let addnumberofmail = true;

const start = () => {
	const leftBar = document.getElementById("LeftRail");
	if (leftBar !== null) {
		chrome.storage.local.get(null, function (value) {
			loadVariables(value);
			clearInterval(startTimer);
			cleanLeftBanner();
			rootFolder();
			cleanMailPub();
			cleanPremium();
			mailCalculator();
			selectAll();
			addButtonClickListeners();
			cleanTopBar();
		})
	}
}

startTimer = setInterval(start, 300);

chrome.storage.onChanged.addListener(function (changes) {
	const updatedElement = Object.keys(changes)[0];
	switch (updatedElement) {
	  case "hideleftbanner":
		hideleftbanner = changes.hideleftbanner.newValue;
		cleanLeftBanner();
		break;
	  case "hidepremiumad":
		hidepremiumad = changes.hidepremiumad.newValue;
		cleanPremium();
		break;
	  case "hidetopicons":
		hidetopicons = changes.hidetopicons.newValue;
		cleanTopBar();
		break;
	}
});

const loadVariables = (value) => {
	hideleftbanner = value.hideleftbanner === undefined ? hideleftbanner : value.hideleftbanner;
	hidepremiumad = value.hidepremiumad === undefined ? hidepremiumad : value.hidepremiumad;
	hidetopicons = value.hidetopicons === undefined ? hidetopicons : value.hidetopicons;

	chrome.storage.local.set({
		hideleftbanner,
		hidepremiumad,
		hidetopicons,
	});
}

const cleanLeftBanner = () => {
    const leftBanner = document.getElementById("LeftRail");
    leftBanner.style.display = hideleftbanner ? "none" : "block";
}

const cleanPremium = () => {
	const findPremium = () => {
		const premiumAd = document.querySelector(".Ogqyq");
		if (premiumAd) {
			premiumAd.style.display = hidepremiumad ? "none" : "block";
			clearInterval(timer2);
		}
	}
	const timer2 = setInterval(findPremium, 100);
}

const cleanTopBar = () => {
	const findTopBar = () => {
		const children = document.getElementById("headerButtonsRegionId").children;
		if (children.length >= 7) {
			document.getElementById("owaMeetNowButton").style.display = hidetopicons ? "none" : "block";
			document.getElementById("skype_container").style.display = hidetopicons ? "none" : "block";
			document.getElementById("owaNoteFeedButton_container").style.display = hidetopicons ? "none" : "block";
			clearInterval(timer2);
		}
	}
	const timer2 = setInterval(findTopBar, 100);
}

const cleanMailPub = () => {
	let counter = 0;
	const findTopMail = () => {
		const topMail = document.querySelector(".cJ3F3");
		if (topMail) {
			topMail.style.display = "none";
			clearInterval(timer2);
		}

		if (counter > 20) {
			clearInterval(timer2);
		}
		counter++;
	}
	const timer2 = setInterval(findTopMail, 150);
}

const rootFolder = () => {
	document.querySelector(".wk4Sg").addEventListener("click", function() {
		cleanMailPub();
	});
}

const selectAll = () => {
	// Reload mailCalculator When click on "select all messages" or "select specify message"
	const findButton = () => {
		const selectAllButton = document.querySelector('.rk2CU');
		const selectMessageButtons = document.querySelectorAll('.d1dnN');

		if (selectAllButton && selectMessageButtons) {
			selectMessageButtons.forEach(button => {
				button.addEventListener("click", () => {
					if (button.getAttribute("aria-checked") === "true") {
						setTimeout(mailCalculator, 100);
					}
				});
			});

			selectAllButton.addEventListener("click", () => {
				if (selectAllButton.getAttribute("aria-checked") === "true") {
					setTimeout(mailCalculator, 100);
				}
			});

			clearInterval(timer2);
		}
	}

	const timer2 = setInterval(findButton, 150);
}

const mailCalculator = () => {
	const findFolder = () => {
		const titleFolder = document.querySelector('.jXaVF');
		if (titleFolder) {
			const titleFolderText = titleFolder.innerText;
			const firstMail = document.querySelector('.hcptT');
			const numberOfEmails = firstMail ? firstMail.getAttribute('aria-setsize') : 0;
			const regex = /\s\(\d+ mails\)/;

			// Prevent duplication
			if (regex.test(titleFolderText)) {
				titleFolder.innerHTML = titleFolderText.replace(regex, ` <b style="color: ${greenColor}">(${numberOfEmails} mails)</b>`);
			} else {
				titleFolder.innerHTML = `${titleFolderText} <b style="color: ${greenColor}">(${numberOfEmails} mails)</b>`;
			}
			clearInterval(timer2);
		}
	}

	const timer2 = setInterval(findFolder, 150);
}

const addButtonClickListeners = () => {
	const findButtons = () => {
		const buttons = document.querySelectorAll('.C2IG3');
		if (buttons) {
			buttons.forEach(button => {
				button.addEventListener('click', () => {
					setTimeout(selectAll, 100);
					setTimeout(mailCalculator, 100);
				});
			});
			clearInterval(timer2);
		}
	}
	const timer2 = setInterval(findButtons, 150);
}
