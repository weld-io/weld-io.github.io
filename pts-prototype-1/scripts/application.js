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

$('.weld-toolbar button').on('click', function (evt) {
	$('.weld-dialog').removeClass('hidden');
});

// Elements

$('.weld-element').draggable().resizable();

// Contrast

var LAYER_CONTRAST = 7;
var TEXT_CONTRAST = 50;

$('#colorSlider').on('input', function (evt) {
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

// Font size

$('body').reactiveCss('font-size', function() {
	return $('#fontSizeSlider').val() + 'px';
});
