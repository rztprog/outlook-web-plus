'use strict';
let startTimer = null;

// Ads
let hideLeftRail = true;
let hideTopIcons = true;
let hideFirstemailAd = true;

// Extras
let emailsText = "emails";
let premiumLogo = false;
let currentTitle = document.title;
let addNumberOfEmail = true;
let numberOfEmailColor = "green";
let checkAllVisible = true;
let alignTitle = true;
let addcustomBackground = true;
let customBackground = "https://wallpapercave.com/wp/wp2757894.gif";
let topbarTransparency = true;
let supportAndRateButton = true;

const start = async () => {
	if (document.getElementById("o365header") !== null) {
		const value = await new Promise(resolve => {
			chrome.storage.local.get(null, value => resolve(value));
		});
		loadVariables(value);
		clearInterval(startTimer);

		await Promise.all([
			cleanLeftRail(),
			updatePremiumLogo(),
			titleListener(),
			cleanFirstmailAd(),
			cleanTopIcons(),
			mailCalculator(),
			handleResizeStarter(),
			deleteButtonListener(),
			selectAll(),
			checkAll(),
			alignFolderTitle(),
			addButtonClickListeners(),
			backgroundChanger(),
			topbarTransparencyChanger(),
			addSupportAndRate(),
        ]);
    }
}

startTimer = setInterval(start, 200);

chrome.storage.onChanged.addListener(function (changes) {
	const updatedElement = Object.keys(changes)[0];
	switch (updatedElement) {
	  	case "hideLeftRail":
			hideLeftRail = changes.hideLeftRail.newValue;
			cleanLeftRail(0);
			break;
		case "hideTopIcons":
			hideTopIcons = changes.hideTopIcons.newValue;
			cleanTopIcons(0);
			break;
		case "premiumLogo":
			premiumLogo = changes.premiumLogo.newValue;
			updatePremiumLogo(0);
			titleListener(0);
			break;
		case "hideFirstemailAd":
			hideFirstemailAd = changes.hideFirstemailAd.newValue;
			cleanFirstmailAd(0);
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
		case "topbarTransparency":
			topbarTransparency = changes.topbarTransparency.newValue;
			topbarTransparencyChanger(0);
			break;
		case "supportAndRateButton":
			supportAndRateButton = changes.supportAndRateButton.newValue;
			addSupportAndRate(0);
			break;
	}
})

const loadVariables = (value) => {
	hideFirstemailAd = value.hideFirstemailAd === undefined ? hideFirstemailAd : value.hideFirstemailAd;
	hideLeftRail = value.hideLeftRail === undefined ? hideLeftRail : value.hideLeftRail;
	hideTopIcons = value.hideTopIcons === undefined ? hideTopIcons : value.hideTopIcons;
	premiumLogo = value.premiumLogo === undefined ? premiumLogo : value.premiumLogo;
	addNumberOfEmail = value.addNumberOfEmail === undefined ? addNumberOfEmail : value.addNumberOfEmail;
	checkAllVisible = value.checkAllVisible === undefined ? checkAllVisible : value.checkAllVisible;
	alignTitle = value.alignTitle === undefined ? alignTitle : value.alignTitle;
	addcustomBackground = value.addcustomBackground === undefined ? addcustomBackground : value.addcustomBackground;
	customBackground = value.customBackground === undefined ? customBackground : value.customBackground;
	topbarTransparency = value.topbarTransparency === undefined ? topbarTransparency : value.topbarTransparency;
	supportAndRateButton = value.supportAndRateButton === undefined ? supportAndRateButton : value.supportAndRateButton;

	if (typeof value.numberOfEmailColor === 'string') {
		numberOfEmailColor = value.numberOfEmailColor;
	}

	chrome.storage.local.set({
		hideLeftRail,
		hideFirstemailAd,
		hideTopIcons,
		premiumLogo,
		addNumberOfEmail,
		numberOfEmailColor,
		checkAllVisible,
		alignTitle,
		addcustomBackground,
		customBackground,
		topbarTransparency,
		supportAndRateButton
	});
}

const handleResizeStarter = () => {
	let executedOnce1050 = false;
	let executedOnce770 = false; 
	let executedOnce542 = false; 

	const handleResize = () => {
		let windowWidth = window.innerWidth;

		// Breakpoint 1050
		if (windowWidth <= 1050 && !executedOnce1050) {
			topbarTransparencyChanger();
			cleanLeftRail();
			cleanTopIcons();
			executedOnce1050 = true;
		} else if (windowWidth > 1050 && executedOnce1050) {  
			topbarTransparencyChanger();
			cleanLeftRail();
			cleanTopIcons();
			executedOnce1050 = false;
		}

		// Breakpoint 770
		if (windowWidth <= 770 && !executedOnce770) {
			alignFolderTitle();
			mailCalculator();
			executedOnce770 = true;
		} else if (windowWidth > 770 && executedOnce770) { 
			alignFolderTitle();
			mailCalculator();
			executedOnce770 = false;
		}

		// Breakpoint 542
		if (windowWidth >= 542 && !executedOnce542) {
			addButtonClickListeners();
			executedOnce542 = true;
		} else if (windowWidth < 542 && executedOnce542) {
			addButtonClickListeners();
			executedOnce542 = false;
		}
	}

	window.addEventListener('resize', handleResize);
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

const deleteButtonListener = (ms = 100, deleteAMessage = false) => {
	let counter = 0;

	const findDeleteButton = () => {
		counter++;
		const deleteButton = document.querySelectorAll('.splitPrimaryButton')[1];

		deleteButton.addEventListener('click', () => {
			const okButton = document.getElementById('ok-1');
		
			if (okButton) {
				okButton.addEventListener('click', () => {
					mailCalculator();
				});
			}

			if (deleteAMessage) {
				setTimeout(mailCalculator, 300);
				setTimeout(alignFolderTitle, 300);
			}

			clearInterval(timer);
		});

		if (counter >= 100) {
			clearInterval(timer);
		}
	}

	const timer = setInterval(findDeleteButton, ms);
}

const mailCalculator = (ms = 150) => {
	let counter = 0;

	const findFolder = () => {
		counter++;

		const folderTitle = document.querySelector('.jXaVF');
		const folderTitleText = folderTitle ? folderTitle.innerText : null;
		const emailsDetector = document.querySelectorAll('.jGG6V');
		const emptyFolder = document.getElementById('EmptyState_MainMessage')

		if (folderTitle && (emailsDetector.length > 0)){
			const firstEmail = emailsDetector[0].getAttribute('aria-posinset') == 1 ? emailsDetector[0] : emailsDetector[1];

			if (firstEmail) {
				const numberOfEmails = firstEmail ? firstEmail.getAttribute('aria-setsize') : 0;
				// const regex = /\s\(\d+ emails\)/; // Old Way
				const regex = new RegExp(`\\s\\(${numberOfEmails} ${emailsText}\\)`);

				// Prevent duplication
				if (regex.test(folderTitleText)) {
					folderTitle.innerHTML = folderTitleText.replace(regex, `<b class="mailColor" style="color: ${numberOfEmailColor}; display: ${addNumberOfEmail ? 'inline' : 'none'}"> (${numberOfEmails} ${emailsText})</b>`);
				} else {			    
					folderTitle.innerHTML = `${folderTitleText} <b class="mailColor" style="color: ${numberOfEmailColor}; display: ${addNumberOfEmail ? 'inline' : 'none'}"> (${numberOfEmails} ${emailsText})</b>`;
				}
				clearInterval(timer);
			}
		}

		if (counter > 100 || emptyFolder) {
			const regex = new RegExp(`\\s\\(${0} ${emailsText}\\)`);

			// Prevent duplication
			if (regex.test(folderTitleText)) {
				folderTitle.innerHTML = folderTitleText.replace(regex, `<b class="mailColor" style="color: ${numberOfEmailColor}; display: ${addNumberOfEmail ? 'inline' : 'none'}"> (${0} ${emailsText})</b>`);
			} else {			    
				folderTitle.innerHTML = `${folderTitleText} <b class="mailColor" style="color: ${numberOfEmailColor}; display: ${addNumberOfEmail ? 'inline' : 'none'}"> (${0} ${emailsText})</b>`;
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

const cleanFirstmailAd = (ms = 100) => {
	// Please use uBlock Origin Extension in addition for a better performance
	let counter = 0;
	const findFirstmailAd = () => {
		const FirstmailAd = document.getElementById("OwaContainer");
		if (FirstmailAd) {
			const titleRemove = document.querySelector('i[title="Remove"]');
			FirstmailAd.style.display = hideFirstemailAd ? "none" : "block";
			if (titleRemove) {
				setTimeout(titleRemove.click(), 200); // Force close first email ad
			}
			clearInterval(timer);
		}

		if (counter >= 60) {
			clearInterval(timer);
		}
		counter++;
	}
	const timer = setInterval(findFirstmailAd, ms);
}

const checkAll = (ms = 100) => {
	const findSelectAllMessagesButton = () => {
		const selectAllMessagesButton = document.querySelector('.rk2CU');
		if (selectAllMessagesButton) {
			checkAllVisible ? selectAllMessagesButton.style.visibility = "visible" : selectAllMessagesButton.style.visibility = "hidden";
			clearInterval(timer);
		}
	}
	const timer = setInterval(findSelectAllMessagesButton, ms);
}

const selectAll = (ms = 150) => {
	// Reload mailCalculator When click on "select all messages" or "select a message"
	const findButton = () => {
		const selectAllMessagesButton = document.querySelector('.rk2CU');
		const selectMessageButtons = document.querySelectorAll('.Q9I6M');

		if (selectAllMessagesButton && selectMessageButtons) {
			selectMessageButtons.forEach(button => {
				button.addEventListener("click", () => {
					if (button.getAttribute("aria-checked") === "true") {
						setTimeout(mailCalculator, 0);
						setTimeout(alignFolderTitle, 0);
					}

					setTimeout(deleteButtonListener(150, true), 0);
				});
			});

			selectAllMessagesButton.addEventListener("click", () => {
				if (selectAllMessagesButton.getAttribute("aria-checked") === "true") {
					setTimeout(alignFolderTitle, 0);
					setTimeout(mailCalculator, 0);
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
					setTimeout(alignFolderTitle, 0);
					setTimeout(mailCalculator, 0);
					setTimeout(cleanFirstmailAd, 0);
					const titleRemove = document.querySelector('i[title="Remove"]');
					if (titleRemove) {
						setTimeout(titleRemove.click(), 200); // Force close first email ad
					}
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

const topbarTransparencyChanger = (ms = 50) => {
	const findTopbarElements = () => {
		const outlookButton = document.querySelector('.o365sx-appName');
		const o365Button = document.querySelectorAll('.o365sx-button');
		const teamsButton = document.querySelector('.nUPgy');

		if (outlookButton && o365Button.length == 12 && teamsButton) {
			const computedStyles = getComputedStyle(outlookButton);
			const currentBackgroundColor = computedStyles.backgroundColor;
			const transparencyConverter = convertToRGBA(currentBackgroundColor, topbarTransparency ? 0 : 0.8);

			function convertToRGBA(color, alpha) {
				const matchHEXA = color.match(/#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i);
				const matchRGB = color.match(/rgb\((\d+), (\d+), (\d+)\)/i);
				const matchRGBA = color.match(/rgba\((\d+), (\d+), (\d+), (0(\.\d+)?|1(\.0)?)\)/i);
				if (matchRGB) {
					return `rgba(${matchRGB[1]}, ${matchRGB[2]}, ${matchRGB[3]}, ${alpha})`;
				} else if (matchRGBA) {
					return `rgba(${matchRGBA[1]}, ${matchRGBA[2]}, ${matchRGBA[3]}, ${alpha})`
				} else if (matchHEXA) {
					return `rgba(${parseInt(matchHEXA[1], 16)}, ${parseInt(matchHEXA[2], 16)}, ${parseInt(matchHEXA[3], 16)}, ${alpha})`;
				} else {
					return
				}
			};

			outlookButton.style.backgroundColor = transparencyConverter;
			teamsButton.style.backgroundColor = transparencyConverter;

			o365Button.forEach(topbarbutton => {
				topbarbutton.style.backgroundColor = transparencyConverter;
			});

			clearInterval(timer);
		}
	}
	const timer = setInterval(findTopbarElements, ms);
}

const addSupportAndRate = (ms = 100) => {
	const findTopbar = () => {
		const topBarButtons = document.getElementById('headerButtonsRegionId');
		if (topBarButtons) {
			if (supportAndRateButton && topBarButtons.firstChild.id == "owaMeetNowButton_container") {
				const newDiv = document.createElement('div');
				newDiv.id = 'rateAndSupport_container';
				newDiv.classList.add('M3pcB5evSAtYMozck1WU7A==');
				newDiv.style.display = 'block';
			
				const link = document.createElement('a');
				link.style.width = '48px';
				link.style.height = '48px';
				link.style.display = 'flex';
				link.style.justifyContent = 'center';
				link.style.alignItems = 'center';
				link.href = 'https://addons.mozilla.org/fr/firefox/addon/outlook-web-plus/reviews/';
				link.target = '_blank';

				const imgIcone = document.createElement('img');
				imgIcone.src = 'https://raw.githubusercontent.com/rztprog/outlook-web-plus/main/icons/stars_rating.png'
			
				link.appendChild(imgIcone);
				newDiv.appendChild(link);
			
				topBarButtons.insertBefore(newDiv, topBarButtons.firstChild);
			} else {
				supportAndRateButton ? topBarButtons.firstChild.style.display = 'block' : topBarButtons.firstChild.style.display = 'none'
			}
			clearInterval(timer);
		}
	}
	const timer = setInterval(findTopbar, ms);
}
