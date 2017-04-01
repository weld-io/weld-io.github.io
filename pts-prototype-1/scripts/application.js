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

$('.weld-toolbar button.openDialog').on('click', function (evt) {
	$('.weld-dialog').removeClass('hidden');
});

// Elements

$('.weld-element').draggable().resizable();

// Colors

var colorThemes = {
	default: {
		'.layer0': '#808689',
		'.layer1': '#ddd',
		'.layer2': '#efefef',
		'.layer3': '#f9f9f9',
	},
	weld: {
		'.layer0': '#eeeff1',
		'.layer1': '#2e3b4b',
		//'.layer1:color': '#ddd',
		'.layer2': '#1b2939',
		'.side-panel.right': '#fbfbfb',
		//'.layer3:color': '#333',
	},
	bright: {
		'.layer0': '#caf',
		'.layer1': '#dad',
		'.layer2': '#abc',
		'.layer3': '#ddd',
	},
	dark: {
		'.layer0': '#253347',
		'.layer1': '#197cd8',
		'.layer2': '#274a72',
		'.layer3': '#f9f9f9',
	},
};

var currentTheme;
var currentContrast = 50;

var setColorTheme = function (theme, contrast) {
	theme = theme || currentTheme || 'default';
	currentTheme = theme;
	currentContrast = contrast || currentContrast;
	var themeStyles = jQuery.extend({}, colorThemes['default'], colorThemes[theme]);
	for (var themeKey in themeStyles) {
		var selector = themeKey.split(':')[0];
		var colorProperty = themeKey.split(':')[1] || 'background-color';
		var colorValue = themeStyles[themeKey];
		// 1. Set text color based on contrast
		if (colorProperty === 'background-color') {
			var backColor = tinycolor(colorValue);
			var foreColor = backColor.different(currentContrast);
			$(selector).css('color', foreColor.toString());
			$(selector).css('border-color', foreColor.toString());
		}
		// 2. Set background/text color based on property
		$(selector).css(colorProperty, colorValue);
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
	return $('#textTransform:checked').length ? 'uppercase' : 'none';
});

// Localize / i18n

var localizeText = function (languageCode) {
	i18next.init(
		{
			lng: languageCode || 'en',
			// evtl. load via xhr https://github.com/i18next/i18next-xhr-backend
			resources: {
				en: {
					translation: {
						settings: 'Settings',
					}
				},
				sv: {
					translation: {
						settings: 'Inställningar',
					}
				},
			}
		},
		function (err, t) {
			jqueryI18next.init(i18next, $);
			$('body').localize();
		}
	);
};

$('#languageList').on('input', function (evt) {
	localizeText($('#languageList').val());	
});
localizeText('en');

// Icon switcher

$('.weld-toolbar .icon').on('click', function (evt, a, b) {
	if (this.dataset.icons) {
		var icons = this.dataset.icons.split(',');
		var currentIndex = _.indexOf(icons, this.dataset.icon);
		$(this).removeClass(this.dataset.icon);
		if ( icons.length > currentIndex + 1) {
			this.dataset.icon = icons[currentIndex + 1];
		} else {
			this.dataset.icon = icons[0];
		}
		$(this).addClass(this.dataset.icon);		
	}
});

