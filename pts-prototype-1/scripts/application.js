$.fn.getTinycolor = function (customProp) {
	var colorProp = customProp || 'background-color';
	return tinycolor(this.css(colorProp));
};

$.fn.setTinycolor = function (tc, customProp) {
	var colorProp = customProp || 'background-color';
	this.css(colorProp, tc.toString());
};

//-----------

tinycolor.prototype.different = function (amount) {
	newColor = this.clone();
	if (this.isDark()) {
		return newColor.lighten(amount);
	}
	else {
		return newColor.darken(amount);
	}
};

// Populate a <select> list
var buildDropdownList = function (jqSelector, collection, selectedValue) {
	for (var keyName in collection) {
		$(jqSelector).append('<option' + (selectedValue === keyName ? ' selected' : '') + '>' + keyName + '</option>');
	}
};

//-----------

// Dialog

$('.close-button').on('click', function (evt) {
	$('.weld-dialog').addClass('hidden');
});

$('.open-settings-dialog').on('click', function (evt) {
	$('.weld-dialog').toggleClass('hidden');
});

$('.open-library').on('click', function (evt) {
	$('.weld-library').toggleClass('hidden');
});

// Elements

$('.weld-element').draggable().resizable();

// Colors

var colorThemes = {
	default: {
		'.weld-canvas-background': '#808689',
		'.side-panel': '#ddd',
		'.weld-toolbar': '#efefef',
		'.weld-dialog': '#f9f9f9',
	},
	weld: {
		'.weld-canvas-background': '#eeeff1',
		'.side-panel': '#2e3b4b',
		//'.side-panel:color': '#ddd',
		'.weld-toolbar': '#1b2939',
		'.side-panel.right': '#fbfbfb',
		//'.weld-dialog:color': '#333',
	},
	pastel: {
		'.weld-canvas-background': '#caf',
		'.side-panel': '#dad',
		'.weld-toolbar': '#abc',
		'.side-panel.right': '#add',
		'.weld-dialog': '#eee',
	},
	darkblue: {
		'.weld-canvas-background': '#253347',
		'.side-panel': '#197cd8',
		'.weld-toolbar': '#274a72',
		'.weld-dialog': '#f9f9f9',
	},
	keynote: {
		'.weld-canvas-background': '#c6cdd5',
		'.weld-editor-panel': '#f6f6f6',
		'.weld-toolbar': '#dedee3',
		'.weld-toolbar:background': 'linear-gradient(to bottom, #dedee3 0%, #c9c9ce 100%)',
		'.weld-dialog': '#ececec',
	},
	photoshop: {
		'.weld-canvas-background': '#262626',
		'.weld-editor-panel': '#535353', // #454545
		'.weld-dialog': '#e9e8e9',		
	},
};

var currentTheme;
var currentContrast = 50;

var setColorTheme = function (theme, contrast) {
	theme = theme || currentTheme || 'default';
	currentTheme = theme;
	currentContrast = contrast || currentContrast;
	var themeStyles = jQuery.extend({}, colorThemes['default'], colorThemes[theme]);
	// Update all CSS classes in themeStyles
	for (var themeKey in themeStyles) {
		var selector = themeKey.split(':')[0];
		var colorProperty = themeKey.split(':')[1] || 'background-color';
		var colorValue = themeStyles[themeKey];
		// 1. Set text color based on contrast
		if (colorProperty === 'background-color') {
			var backColor = tinycolor(colorValue);
			var foreColor = backColor.different(currentContrast);
			// Text color
			$(selector).css('color', foreColor.toString());
			// Input
			$(selector + ' input').css('border-color', foreColor.toString());
			$(selector + ' select').css('border-color', foreColor.toString());
			// Button
			// Reset background
			$(selector).css('background', 'initial');
		}
		// 2. Set background/text color based on property
		$(selector).css(colorProperty, colorValue);
	}
	// Set class on <body>
	var toolbarColor = tinycolor($('.weld-toolbar').css('background-color'));
	if (toolbarColor.isDark()) {
		$('body').addClass('dark-theme');
		$('body').removeClass('light-theme');
	}
	else {
		$('body').addClass('light-theme');
		$('body').removeClass('dark-theme');
	}
};

$('#colorTheme').on('input', function (evt) {
	setColorTheme($('#colorTheme').val());	
});
setColorTheme();
buildDropdownList('#colorTheme', colorThemes, 'default');

// Contrast

$('#contrastValue').on('input', function (evt) {
	setColorTheme(undefined, evt.target.value);
});

// Font

$('body').reactiveCss('font-size', function() {
	return $('#fontSize').val() + 'px';
});

$('body').reactiveCss('font-family', function() {
	return $('#fontFamily').val();
});

$('body').reactiveCss('text-transform', function() {
	return $('#textTransform').val();
});

// Localize text

var locales = {
	'Menu': { sv: 'Meny' },
	'Settings': { sv: 'Inställningar' },
	'Page': { sv: 'Sida' },
	'Update': { sv: 'Uppdatera' },
	'Font:': { sv: 'Teckensnitt:' },
	'My projects': { sv: 'Mina projekt' },
	'Select': { sv: 'Markera' },
	'Box': { sv: 'Rektangel' },
	'Image': { sv: 'Bild' },
	'Library': { sv: 'Bibliotek' },
	'Objects': { sv: 'Objekt' },
	'Undo': { sv: 'Ångra' },
	'Edit': { sv: 'Redigera' },
	'New screen': { sv: 'Ny skärm' },
	'Help': { sv: 'Hjälp' },
	'Preview': { sv: 'Förhandsgranska' },
	'Publish': { sv: 'Publicera' },
}
var currentLanguageCode = 'en';

var simpleLocalization = function (parentNode, languageCode, doUpdateLocales) {

	var findLocaleByString = function (str, langCode) {
		return _.find(locales, function (localeObj, localeKey) {
			return localeKey === str || localeObj[langCode] === str;
		});
	};

	var hasTextAndIsDifferent = function (translationObj, languageCode, $element) {
		return _.has(translationObj, languageCode) && $element.text() !== translationObj[languageCode];
	};

	var updateTextNodesRecursively = function (parentNode, languageCode, doUpdateLocales) {
		var childs = parentNode.children();
		for (var i = 0; i < childs.length; i++) {
			// http://stackoverflow.com/questions/3442394/using-text-to-retrieve-only-text-not-nested-in-child-tags
			var rawText = $(childs[i])
				.clone()    // clone the element
				.children() // select all the children
				.remove()   // remove all the children
				.end()      // again go back to selected element
				.text()
				.trim();
			if (rawText !== '') {
				if (doUpdateLocales) {
					// Update 'locales' from DOM
					locales[rawText] = locales[rawText] || {};
					locales[rawText][languageCode] = rawText;
				}
				else {
					// Translate text
					var translationObj = findLocaleByString(rawText, currentLanguageCode);
					var $element = $(childs[i]);
					if (hasTextAndIsDifferent(translationObj, languageCode, $element)) {
						$element.text(translationObj[languageCode]);
						// CSS animation
						$element.addClass('animate-locale-change');
						setTimeout(function () {
							$element.removeClass('animate-locale-change');
						}, 1500);
					}
				}
			}
			updateTextNodesRecursively($(childs[i]), languageCode, doUpdateLocales);
		}
	};

	updateTextNodesRecursively(parentNode, languageCode, doUpdateLocales);
	currentLanguageCode = languageCode;

};

$('#languageList').on('input', function (evt) {
	simpleLocalization($('body'), $('#languageList').val());
	currentLanguageCode = $('#languageList').val();
});
// Save English texts from DOM to 'locales'
simpleLocalization($('body'), currentLanguageCode, true);

// Icon switcher

$('.weld-toolbar button').on('click', function (evt, a, b) {
	if (this.dataset.icons) {
		var icons = this.dataset.icons.split(',');
		var currentIndex = _.indexOf(icons, this.dataset.icon);
		var iconNode = $(this).find('[class^="icon-"]');
		iconNode.removeClass(this.dataset.icon);
		if ( icons.length > currentIndex + 1) {
			this.dataset.icon = icons[currentIndex + 1];
		} else {
			this.dataset.icon = icons[0];
		}
		iconNode.addClass(this.dataset.icon);
	}
});

