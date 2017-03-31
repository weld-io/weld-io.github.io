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
		'.weld-editor-background': '#808689',
		'.weld-editor-panel': '#ddd',
		'.weld-editor-panel:color': '#53585f',
		'.weld-toolbar': '#efefef',
		'.weld-dialog': '#f9f9f9',
	},
	weld: {
		'.weld-editor-background': '#eeeff1',
		'.weld-editor-panel': '#2e3b4b',
		'.weld-editor-panel:color': '#ddd',
		'.weld-toolbar': '#1b2939',
		'.side-panel.right': '#fbfbfb',
		'.weld-dialog:color': '#333',
	},
	bright: {
		'.weld-editor-background': '#caf',
		'.weld-editor-panel': '#dad',
		//'.weld-editor-panel:color': '#53585f',
		'.weld-toolbar': '#abc',
		'.weld-dialog': '#ddd',
	},
	dark: {
		'.weld-editor-background': 'darkblue',
		'.weld-editor-panel': 'blue',
	},
};

var setColorTheme = function (theme, contrast) {
	theme = theme || 'default';
	var themeStyles = jQuery.extend({}, colorThemes['default'], colorThemes[theme]);
	for (var themeKey in themeStyles) {
		var selector = themeKey.split(':')[0];
		var colorProperty = themeKey.split(':')[1] || 'background-color';
		var colorValue = themeStyles[themeKey];
		$(selector).css(colorProperty, colorValue);
	}
};

$('#colorTheme').on('input', function (evt) {
	setColorTheme($('#colorTheme').val());	
});
//setColorTheme();

// Contrast

var LAYER_CONTRAST = 7;
var TEXT_CONTRAST = 50;

$('#brightnessValue').on('input', function (evt) {
	//console.log(evt.target.value);
	// Layer3
	var layer3Color = tinycolor({ r: evt.target.value, g: evt.target.value, b: evt.target.value });
	$('.layer3').setTinycolor(layer3Color);
	$('.layer3').setTinycolor(layer3Color.different(TEXT_CONTRAST), 'color');
	// Layer2
	var layer2Color = layer3Color.different(LAYER_CONTRAST);
	$('.layer2').setTinycolor(layer2Color);
	$('.layer2').setTinycolor(layer2Color.different(TEXT_CONTRAST), 'color');
	// Layer1
	var layer1Color = layer3Color.different(2*LAYER_CONTRAST);
	$('.layer1').setTinycolor(layer1Color);
	$('.layer1').setTinycolor(layer1Color.different(TEXT_CONTRAST), 'color');
	// Layer0 - Background
	var layer0Color = layer3Color.different(7*LAYER_CONTRAST);
	$('.layer0').setTinycolor(layer0Color);
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
// Icon switcher

$('.weld-toolbar .icon').on('click', function (evt, a, b) {
	var icons = this.dataset.icons.split(',');
	var currentIndex = _.indexOf(icons, this.dataset.icon);
	$(this).removeClass(this.dataset.icon);
	if ( icons.length > currentIndex + 1) {
		this.dataset.icon = icons[currentIndex + 1];
	} else {
		this.dataset.icon = icons[0];
	}
	$(this).addClass(this.dataset.icon);
});

$('#languageList').on('input', function (evt) {
	localizeText($('#languageList').val());	
});
localizeText('en');
