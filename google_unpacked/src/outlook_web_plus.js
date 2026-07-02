'use strict';
let startTimer = null;

// Cleanup
let hideLeftRail = true;
let hideFirstemailAd = true;

// Extras
const regex = /\s\(\d+ emails\)/;
const regexEmail = /\s\(\d+ email\)/;
const defaultMs = 100;
let observer = null;
let emailsText = 'emails';
let addEmailCalculator = true;
let emailCalculatorColor = '#008000';
let alignTitle = true;
let addcustomBackground = true;
let customBackground = 'https://wallpapercave.com/wp/wp2757894.gif';
let topbarTransparency = true;
let supportAndRateButton = true;
let folderTitleObserver = null;
let currentObservedFolderButton = null;

const start = async () => {
	if (document.getElementById('OwaTitleBar') !== null) {
		const value = await new Promise(resolve => {
			chrome.storage.local.get(null, value => resolve(value));
		});
		loadVariables(value);
		clearInterval(startTimer);

		await Promise.all([
			cleanLeftRail(defaultMs), // ok			
			cleanFirstEmailAd(300), // ok
			cleanBannerAd(300),
			emailCalculator(emailsText, defaultMs), // ok
			emailCalculatorReloader(),  // ok
			resizeHandler(defaultMs), // ok
			alignFolderTitle(defaultMs), // ok
			emailFolderListeners(defaultMs), // ok
			backgroundChanger(defaultMs), // ok
			topbarTransparencyChanger(400) // ok
        ]);
	
		addSupportAndRate(300);
    }
}

startTimer = setInterval(start, 200);

chrome.storage.onChanged.addListener(function (changes) {
	console.log('[OWP Content] storage changed:', changes);
	const updatedElement = Object.keys(changes)[0];
	switch (updatedElement) {
	  	case 'hideLeftRail':
			hideLeftRail = changes.hideLeftRail.newValue;
			cleanLeftRail();
			break;
		case 'hideFirstemailAd':
			hideFirstemailAd = changes.hideFirstemailAd.newValue;
			cleanFirstEmailAd();
			cleanBannerAd();
			break;
		case 'addEmailCalculator':
			addEmailCalculator = changes.addEmailCalculator.newValue;
			emailCalculator();
			break;
		case 'emailCalculatorColor':
			emailCalculatorColor = changes.emailCalculatorColor.newValue;
			updateEmailCounterColor();
			break;
		case 'alignTitle':
			alignTitle = changes.alignTitle.newValue;
			alignFolderTitle();
			break;
		case 'addcustomBackground':
			addcustomBackground = changes.addcustomBackground.newValue;
			backgroundChanger();
			break;
		case 'customBackground':
			customBackground = changes.customBackground.newValue;
			backgroundChanger();
			break;
		case 'topbarTransparency':
			topbarTransparency = changes.topbarTransparency.newValue;
			topbarTransparencyChanger();
			break;
		case 'supportAndRateButton':
			supportAndRateButton = changes.supportAndRateButton.newValue;
			addSupportAndRate();
			break;
	}
})

const loadVariables = (value) => {
	hideFirstemailAd = value.hideFirstemailAd === undefined ? hideFirstemailAd : value.hideFirstemailAd;
	hideLeftRail = value.hideLeftRail === undefined ? hideLeftRail : value.hideLeftRail;
	addEmailCalculator = value.addEmailCalculator === undefined ? addEmailCalculator : value.addEmailCalculator;
	alignTitle = value.alignTitle === undefined ? alignTitle : value.alignTitle;
	addcustomBackground = value.addcustomBackground === undefined ? addcustomBackground : value.addcustomBackground;
	customBackground = value.customBackground === undefined ? customBackground : value.customBackground;
	topbarTransparency = value.topbarTransparency === undefined ? topbarTransparency : value.topbarTransparency;
	supportAndRateButton = value.supportAndRateButton === undefined ? supportAndRateButton : value.supportAndRateButton;

	if (typeof value.emailCalculatorColor === 'string') {
		emailCalculatorColor = value.emailCalculatorColor;
	}

	chrome.storage.local.set({
		hideLeftRail,
		hideFirstemailAd,
		addEmailCalculator,
		emailCalculatorColor,
		alignTitle,
		addcustomBackground,
		customBackground,
		topbarTransparency,
		supportAndRateButton
	});
}

const resizeHandler = () => {
	let executedOnce1050 = false;
	let executedOnce770 = false; 
	let executedOnce542 = false; 

	const resizeBreakpoints = () => {
		let windowWidth = window.innerWidth;

		// Breakpoint 1050
		if (windowWidth <= 1050 && !executedOnce1050) {
			topbarTransparencyChanger();
			cleanLeftRail();
			executedOnce1050 = true;
		} else if (windowWidth > 1050 && executedOnce1050) {  
			topbarTransparencyChanger();
			cleanLeftRail();
			executedOnce1050 = false;
		}

		// Breakpoint 770
		if (windowWidth <= 770 && !executedOnce770) {
			alignFolderTitle();
			emailCalculator();
			executedOnce770 = true;
		} else if (windowWidth > 770 && executedOnce770) { 
			alignFolderTitle();
			emailCalculator();
			executedOnce770 = false;
		}

		// Breakpoint 542
		if (windowWidth < 542 && !executedOnce542) {
			emailFolderListeners();
			executedOnce542 = true;
		} else if (windowWidth >= 542 && executedOnce542) {
			emailFolderListeners();
			executedOnce542 = false;
		}
	}

	window.addEventListener('resize', resizeBreakpoints);
	resizeBreakpoints();
}

const emailCalculatorReloader = () => {
	document.addEventListener('click', (e) => {
		const clickedSimple = e.target;
		const clickedElement = e.target?.parentNode?.parentNode?.parentNode;

		if (!clickedSimple || !clickedElement) return;

		const shouldReload =
			clickedSimple.classList?.contains('r1ls86vo') ||
			clickedElement.classList?.contains('is-checked') ||
			clickedElement.id?.startsWith('ok-') ||
			clickedElement.classList?.contains('ac0xq') ||
			clickedElement.classList?.contains('p4pwT') ||
			clickedElement.parentNode?.classList?.contains('BPfgd');

		if (!shouldReload) return;

		// Fallback : Outlook peut remplacer les nodes après certaines actions.
		setTimeout(() => {
			emailFolderListeners();
			alignFolderTitle();

			if (currentObservedFolderButton?.title) {
				emailCalculator(currentObservedFolderButton.title);
			} else {
				emailCalculator();
			}
		}, 100);
	}, { capture: true });
};

const removeExistingEmailCounter = (folderTitle) => {
	const existingCounter = folderTitle.querySelector('.mailColor');
	if (existingCounter) {
		existingCounter.remove();
	}
};

const getFolderCounterText = async (title, folderTitleText) => {
	if (typeof title === 'string' && title.includes(' - ')) {
		return title.split(' - ')[1];
	}

	return await firstStartDetector(folderTitleText);
};

const updateEmailCounterColor = () => {
    const counter = document.querySelector('.mailColor');

    if (counter) {
        counter.style.color = emailCalculatorColor;
    } else {
        emailCalculator();
    }
};

const emailCalculator = (title = emailsText, ms = 0) => {
	const findFolder = async () => {
		const folderTitle = document.querySelector('.jXaVF');

		if (window.location.href.includes('calendar')) {
			clearInterval(timer);
			return;
		}

		if (!folderTitle) {
			return;
		}

		folderTitle.style.display = "flex";
		folderTitle.style.alignItems = "center";

		const cleanFolderTitleText = folderTitle.childNodes[0]?.textContent?.trim() || folderTitle.innerText.trim();
		const counterText = await getFolderCounterText(title, cleanFolderTitleText);

		if (!counterText) {
			clearInterval(timer);
			return;
		}

		removeExistingEmailCounter(folderTitle);

		const counterElement = document.createElement('b');
		counterElement.className = 'mailColor';
		counterElement.textContent = ` ${counterText}`;
		counterElement.style.color = emailCalculatorColor;
		counterElement.style.marginLeft = "0.5rem";
		counterElement.style.display = addEmailCalculator ? 'inline' : 'none';

		folderTitle.appendChild(counterElement);
		emailsText = counterText;

		clearInterval(timer);
	};

	const timer = setInterval(findFolder, ms);
};

const firstStartDetector = (actualTitle, ms = 0) => {
	return new Promise((resolve) => {
		const timer = setInterval(() => {
			const buttons = [...document.querySelectorAll('.oTkSL')];

			const button = buttons.find(button =>
				button.getAttribute("data-folder-name")?.toLowerCase() === actualTitle.toLowerCase()
			);

			if (button) {
				clearInterval(timer);
				resolve(button.title.split(" - ")[1]);
			}
		}, ms);
	});
};

const cleanLeftRail = () => {
    const leftRail = document.getElementById('LeftRail');
    leftRail.style.display = hideLeftRail ? 'none' : 'block';
}

const alignFolderTitle = (ms = 0, reloader = false) => {
	const findFolderTitle = () => {
		const folderTitle = document.querySelector('.IG8s8');
		if (folderTitle) {
			alignTitle ? folderTitle.style.paddingLeft = '0px' : folderTitle.style.paddingLeft = '16px';
		} else {
			// console.log(`folderTitle not found`)
		}
		clearInterval(timer);
	}
	const timer = setInterval(findFolderTitle, ms);
}

const cleanFirstEmailAd = (ms = 0) => {
	// Please use uBlock Origin Extension in addition for a better performance
	let counter = 0;
	const findFirstmailAd = () => {
		const firstmailAd = document.getElementById('OwaContainer');
		if (firstmailAd) {
			firstmailAd.style.display = hideFirstemailAd ? 'none' : 'block';
			clearInterval(timer);
		}

		if (counter >= 30) {
			clearInterval(timer);
		}
		counter++;
	}
	const timer = setInterval(findFirstmailAd, ms);
}

const cleanBannerAd = (ms = 0) => {
	// Please use uBlock Origin Extension in addition for a better performance
	let counter = 0;
	const findBannerAd = () => {
		const findBannerAd = document.querySelector('.GssDD');
		if (findBannerAd) {
			findBannerAd.style.display = hideFirstemailAd ? 'none' : 'block';
			clearInterval(timer);
		}

		if (counter >= 30) {
			clearInterval(timer);
		}
		counter++;
	}
	const timer = setInterval(findBannerAd, ms);
}

const observeCurrentFolderButton = (button) => {
	if (!button) return;

	// Disconnect previous observer
	if (folderTitleObserver) {
		folderTitleObserver.disconnect();
		folderTitleObserver = null;
	}

	currentObservedFolderButton = button;

	folderTitleObserver = new MutationObserver((mutationsList) => {
		for (const mutation of mutationsList) {
			if (mutation.type === 'attributes' && mutation.attributeName === 'title') {
				emailCalculator(button.title);
				alignFolderTitle();
			}
		}
	});

	folderTitleObserver.observe(button, {
		attributes: true,
		attributeFilter: ['title']
	});
};

const emailFolderListeners = (ms = 0) => {
	const findButtons = () => {
		const buttons = document.querySelectorAll('.oTkSL');

		if (buttons.length) {
			buttons.forEach(button => {
				if (button.dataset.owpListenerAttached === 'true') return;

				button.dataset.owpListenerAttached = 'true';

				button.addEventListener('click', () => {
					observeCurrentFolderButton(button);

					setTimeout(() => alignFolderTitle(), 150);
					setTimeout(() => emailCalculator(button.title), 150);
					setTimeout(() => cleanFirstEmailAd(), 150);
				});
			});

			const folderTitle = document.querySelector('.jXaVF');
			if (folderTitle) {
				const cleanFolderTitleText =
					folderTitle.childNodes[0]?.textContent?.trim() ||
					folderTitle.innerText.trim();

				const activeButton = [...buttons].find(button =>
					button.getAttribute('data-folder-name')?.toLowerCase() === cleanFolderTitleText.toLowerCase()
				);

				if (activeButton) {
					observeCurrentFolderButton(activeButton);
				}
			}

			clearInterval(timer);
		}
	};

	const timer = setInterval(findButtons, ms);
};

const backgroundChanger = (ms = 0) => {
	const findBackground = () => {
		const backgroundNav = document.getElementById("OwaTitleBar").getElementsByTagName('div')[1];
		const realNav = backgroundNav.classList.contains("hl2hm"); // Ensure

		if (backgroundNav && realNav && addcustomBackground) {
			backgroundNav.style.backgroundImage = `url("${customBackground}")`;
			backgroundNav.style.backgroundPosition = 'center';
			backgroundNav.style.backgroundRepeatX = 'repeat';
			backgroundNav.style.backgroundSize = 'cover';
			clearInterval(timer);
		}

		if (!addcustomBackground) {
			backgroundNav.style.backgroundImage = '';
			clearInterval(timer);
		}
	}
	const timer = setInterval(findBackground, ms);
}

const topbarTransparencyChanger = (ms = 0) => {
	const findTopbarElements = () => {
		const owaTitleBarButtons = document.getElementById("OwaTitleBar").querySelectorAll('.fui-Button');
		const outlookButton = document.getElementById("owaBranding_container");
		const accountButton = document.getElementById("owa-me-control-container");

		if (outlookButton && accountButton && owaTitleBarButtons.length >= 3) {
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

			accountButton.parentElement.style.backgroundColor = transparencyConverter;

			owaTitleBarButtons.forEach(topbarbutton => {
				topbarbutton.style.backgroundColor = transparencyConverter;
				topbarbutton.style.transition = "background-color 0.1s ease-out";

				topbarbutton.addEventListener("mouseover", () => {
					topbarbutton.style.backgroundColor = "rgba(255, 255, 255, 0.2)"; // Fond opaque au survol
				});
			
				topbarbutton.addEventListener("mouseout", () => {
					topbarbutton.style.backgroundColor = transparencyConverter; // Revenir à la transparence
				});
			});

			clearInterval(timer);
		}
	}
	const timer = setInterval(findTopbarElements, ms);
}

const addSupportAndRate = (ms = 0) => {
	const findTopbar = () => {
		const searchBox = document.getElementById("searchBoxColumnContainerId");
		const grandParent = searchBox.parentElement.parentElement;		
		const rateButton = document.getElementById('rateAndSupport_container');

		if (rateButton) {
			supportAndRateButton ? rateButton.style.display = 'block' : rateButton.style.display = 'none';
			clearInterval(timer);
			return;
		}

		if (searchBox) {
			const newDiv = document.createElement('div');
			const firefoxLink = 'https://addons.mozilla.org/fr/firefox/addon/outlook-web-plus/reviews';
			const chromeLink = 'https://chromewebstore.google.com/detail/outlook-web-plus/jgomcpcjiffhcbmodgkekfenhhmjphpn/reviews';

			newDiv.id = 'rateAndSupport_container';
			newDiv.classList.add('M3pcB5evSAtYMozck1WU7A==');
			newDiv.style.display = 'block';
			newDiv.style.marginLeft = "auto";

			const link = document.createElement('a');
			link.style.width = '48px';
			link.style.height = '48px';
			link.style.display = 'flex';
			link.style.justifyContent = 'center';
			link.style.alignItems = 'center';
			link.href = navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ? firefoxLink : chromeLink;
			link.target = '_blank';

			link.style.transition = "background-color 0.1s ease-out";
			link.addEventListener("mouseover", () => {
				link.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
			});
			link.addEventListener("mouseout", () => {
				link.style.backgroundColor = "rgba(255, 255, 255, 0)";
			});

			const imgIcone = document.createElement('img');
			imgIcone.src = chrome.runtime.getURL("icons/etoile.svg");
			imgIcone.style.color = "white";
			imgIcone.width = 20;
			imgIcone.height = 20;

			link.appendChild(imgIcone);
			newDiv.appendChild(link);

			grandParent.insertBefore(newDiv, grandParent.firstElementChild.nextSibling);
			return;
		}

	}
	const timer = setInterval(findTopbar, ms);
}
