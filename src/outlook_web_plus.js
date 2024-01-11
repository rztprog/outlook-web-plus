'use strict';
let startTimer = null;

// Ads
let hideLeftRail = true;
let hidePremiumAd = true;
let hideTopIcons = true;

// Extras
let premiumLogo = false;
let currentTitle = document.title;
let addNumberOfEmail = true;
let numberOfEmailColor = "green";
let checkAllVisible = true;
let alignTitle = true;
let addcustomBackground = false;
let customBackground = "https://images.unsplash.com/photo-1553949285-bdcb31ec5cba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const start = () => {
	const leftRail = document.getElementById("LeftRail");
	if (leftRail !== null) {
		chrome.storage.local.get(null, function (value) {
			loadVariables(value);
			clearInterval(startTimer);
			cleanLeftRail();
			rootFolder();
			updatePremiumLogo();
			titleListener();
			cleanMailPub();
			cleanPremiumAd();
			cleanTopIcons();
			mailCalculator();
			selectAll();
			checkAll();
			alignFolderTitle();
			addButtonClickListeners();
			backgroundChanger();
		})
	}
}

startTimer = setInterval(start, 200);

chrome.storage.onChanged.addListener(function (changes) {
	const updatedElement = Object.keys(changes)[0];
	switch (updatedElement) {
	  	case "hideLeftRail":
			hideLeftRail = changes.hideLeftRail.newValue;
			cleanLeftRail();
			break;
	 	 case "hidePremiumAd":
			hidePremiumAd = changes.hidePremiumAd.newValue;
			cleanPremiumAd(0);
			break;
	  	case "hideTopIcons":
			hideTopIcons = changes.hideTopIcons.newValue;
			cleanTopIcons(0);
			break;
		case "premiumLogo":
			premiumLogo = changes.premiumLogo.newValue;
			updatePremiumLogo(0);
            titleListener();
			break;
		case "addNumberOfEmail":
			addNumberOfEmail = changes.addNumberOfEmail.newValue;
			mailCalculator(0);
			break;
		case "numberOfEmailColor":
			numberOfEmailColor = changes.numberOfEmailColor.newValue;
			mailCalculator(0);
			break;
		case "checkAllVisible":
			checkAllVisible = changes.checkAllVisible.newValue;
			checkAll(0);
			break;
		case "alignTitle":
			alignTitle = changes.alignTitle.newValue;
			alignFolderTitle(0);
			break;
		case "addcustomBackground":
			addcustomBackground = changes.addcustomBackground.newValue;
			backgroundChanger(0);
			break;
		case "customBackground":
			customBackground = changes.customBackground.newValue;
			backgroundChanger(0);
			break;
	}
})

const loadVariables = (value) => {
	hideLeftRail = value.hideLeftRail === undefined ? hideLeftRail : value.hideLeftRail;
	hidePremiumAd = value.hidePremiumAd === undefined ? hidePremiumAd : value.hidePremiumAd;
	hideTopIcons = value.hideTopIcons === undefined ? hideTopIcons : value.hideTopIcons;
	premiumLogo = value.premiumLogo === undefined ? premiumLogo : value.premiumLogo;
	addNumberOfEmail = value.addNumberOfEmail === undefined ? addNumberOfEmail : value.addNumberOfEmail;
	checkAllVisible = value.checkAllVisible === undefined ? checkAllVisible : value.checkAllVisible;
	alignTitle = value.alignTitle === undefined ? alignTitle : value.alignTitle;
	addcustomBackground = value.addcustomBackground === undefined ? addcustomBackground : value.addcustomBackground;
	customBackground = value.customBackground === undefined ? customBackground : value.customBackground;

	if (typeof value.numberOfEmailColor === 'string') {
		numberOfEmailColor = value.numberOfEmailColor;
	}

	chrome.storage.local.set({
		hideLeftRail,
		hidePremiumAd,
		hideTopIcons,
		premiumLogo,
		addNumberOfEmail,
		numberOfEmailColor,
		checkAllVisible,
		alignTitle,
		addcustomBackground,
		customBackground
	});
}

const titleListener = (ms = 100) => {
	const calendarButton = document.getElementById("owaTimePanelBtn_container");

	// Need to fix, because when findTitle is reloaded documentTitle is the oldest one
	calendarButton.addEventListener('click', () => {
		const findopenCalendarButton = () => {
			const openCalendarButton = document.querySelector('button[title="Open Calendar"]');
			if (openCalendarButton) {
				openCalendarButton.addEventListener('click', () => {
					findTitle();
				});
				clearInterval(timer2);
			}
		}
		const timer2 = setInterval(findopenCalendarButton, ms);
	});

	const findTitle = () => {
		if (document.title !== currentTitle) {
		  currentTitle = document.title;
		  if (premiumLogo && !currentTitle.endsWith('+')) {
			currentTitle += '+';
			document.title = currentTitle;
		  }
		}
		clearInterval(timer);
	}
	const timer = setInterval(findTitle, ms);
}

const updatePremiumLogo = (ms = 100) => {
	const findAppName = () => {
		const appName = document.getElementById("O365_AppName");
		if (appName) {
			const appNameSpan = appName.querySelector("span");
			if (appNameSpan && premiumLogo) {
                appNameSpan.innerHTML = "Outlook+";

				appNameSpan.style.background = "linear-gradient(110deg, rgb(20, 144, 223), rgb(40, 168, 234), rgb(156, 206, 231), rgb(40, 168, 234), rgb(20, 144, 223)";				appNameSpan.style.backgroundSize = "200% 100%";
				appNameSpan.style.backgroundClip = "text";
				appNameSpan.style.color = "transparent";
				appNameSpan.style.animation = "shiny 5s linear infinite";
				appNameSpan.style.fontSize = "16px";

				appNameSpan.animate([
					{ backgroundPosition: '-100% 0' },
					{ backgroundPosition: '100% 0' }
				  ], {
					duration: 6000,
					iterations: Infinity
				  });
			} else {
				appNameSpan.innerHTML = "Outlook";
				appNameSpan.style = "";
			}
			clearInterval(timer);
		}
	}
	const timer = setInterval(findAppName, ms);
}

const mailCalculator = (ms = 150) => {
	const findFolder = () => {
		const titleFolder = document.querySelector('.jXaVF');
		if (titleFolder) {
			const titleFolderText = titleFolder.innerText;
			const firstMail = document.querySelector('.hcptT');
			const numberOfEmails = firstMail ? firstMail.getAttribute('aria-setsize') : 0;
			const regex = /\s\(\d+ mails\)/;

			// Prevent duplication
			if (regex.test(titleFolderText)) {
				titleFolder.innerHTML = titleFolderText.replace(regex, `<b class="mailColor" style="color: ${numberOfEmailColor}; display: ${addNumberOfEmail ? 'inline' : 'none'}"> (${numberOfEmails} mails)</b>`);
			} else {			    
				titleFolder.innerHTML = `${titleFolderText} <b class="mailColor" style="color: ${numberOfEmailColor}; display: ${addNumberOfEmail ? 'inline' : 'none'}"> (${numberOfEmails} mails)</b>`;
			}
			clearInterval(timer);
		}
	}
	const timer = setInterval(findFolder, ms);
}

const cleanLeftRail = () => {
    const leftRail = document.getElementById("LeftRail");
    leftRail.style.display = hideLeftRail ? "none" : "block";
}

const cleanPremiumAd = (ms = 100) => {
	const findPremium = () => {
		const premiumAd = document.querySelector(".Ogqyq");
		if (premiumAd) {
			premiumAd.style.display = hidePremiumAd ? "none" : "block";
			clearInterval(timer);
		}
	}
	const timer = setInterval(findPremium, ms);
}

const alignFolderTitle = (ms = 100) => {
	const findFolderTitle = () => {
		const folderTitle = document.querySelector(".IG8s8");

		if (folderTitle) {
			alignTitle ? folderTitle.style.paddingLeft = '0px' : folderTitle.style.paddingLeft = '16px';
			clearInterval(timer);
		}
	}
	const timer = setInterval(findFolderTitle, ms);
}

const cleanTopIcons = (ms = 100) => {
	const findTopBar = () => {
		const children = document.getElementById("headerButtonsRegionId").children;
		if (children.length >= 7) {
			document.getElementById("owaMeetNowButton_container").style.display = hideTopIcons ? "none" : "block";
			document.getElementById("teams_container").style.display = hideTopIcons ? "none" : "block";
			document.getElementById("owaNoteFeedButton_container").style.display = hideTopIcons ? "none" : "block";
			clearInterval(timer);
		}
	}
	const timer = setInterval(findTopBar, ms);
}

const cleanMailPub = (ms = 100) => {
	let counter = 0;
	const findTopMail = () => {
		const topMail = document.querySelector(".cJ3F3");
		if (topMail) {
			topMail.style.display = "none";
			clearInterval(timer);
		}

		if (counter > 20) {
			clearInterval(timer);
		}
		counter++;
	}
	const timer = setInterval(findTopMail, ms);
}

const rootFolder = () => {
	document.querySelector(".wk4Sg").addEventListener("click", function() {
		cleanMailPub();
	});
}

const checkAll = (ms = 100) => {
	const findSelectAllButton = () => {
		const selectAllButton = document.querySelector('.rk2CU');

		if (selectAllButton) {
			checkAllVisible ? selectAllButton.style.visibility = "visible" : selectAllButton.style.visibility = "hidden";
			clearInterval(timer);
		}
	}
	const timer = setInterval(findSelectAllButton, ms);
}

const selectAll = (ms = 150) => {
	// Reload mailCalculator When click on "select all messages" or "select a message"
	const findButton = () => {
		const selectAllButton = document.querySelector('.rk2CU');
		const selectMessageButtons = document.querySelectorAll('.d1dnN');

		if (selectAllButton && selectMessageButtons) {
			selectMessageButtons.forEach(button => {
				button.addEventListener("click", () => {
					if (button.getAttribute("aria-checked") === "true") {
						setTimeout(alignFolderTitle, 100);
						setTimeout(mailCalculator, 300);
					}
				});
			});

			selectAllButton.addEventListener("click", () => {
				if (selectAllButton.getAttribute("aria-checked") === "true") {
					setTimeout(alignFolderTitle, 100);
					setTimeout(mailCalculator, 300);
				}
			});
			clearInterval(timer);
		}
	}
	const timer = setInterval(findButton, ms);
}

const addButtonClickListeners = (ms = 150) => {
	const findButtons = () => {
		const buttons = document.querySelectorAll('.C2IG3');
		if (buttons) {
			buttons.forEach(button => {
				button.addEventListener('click', () => {
					setTimeout(checkAll, 100);
					setTimeout(selectAll, 100);
					setTimeout(alignFolderTitle, 100);
					setTimeout(mailCalculator, 300);
				});
			});
			clearInterval(timer);
		}
	}
	const timer = setInterval(findButtons, ms);
}

const backgroundChanger = (ms = 150) => {
	const findBackground = () => {
		const backgroundNav = document.querySelector('.o365sx-navbar');
		if (backgroundNav && addcustomBackground) {
			backgroundNav.style.backgroundImage = `url("${customBackground}")`;
			backgroundNav.style.backgroundPosition = 'center';
			backgroundNav.style.backgroundRepeatX = 'repeat';
		}
		if (!addcustomBackground) {
			backgroundNav.style.backgroundImage = "";
		}
		clearInterval(timer);
	}
	const timer = setInterval(findBackground, ms);
}
