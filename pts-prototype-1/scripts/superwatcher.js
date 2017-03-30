// ----- SuperWatcher -----

function SuperWatcher() {
	var watchers = [];

	var getValueOf = function(val) {
		return (typeof(val) === 'function' ? val() : val);
	};

	var checkWatchers = function() {
		for (var i in watchers) {
			// Check if value has changed
			if (watchers[i].lastValue !== getValueOf(watchers[i].watching)) {
				watchers[i].lastValue = getValueOf(watchers[i].watching);
				// Trigger callback
				if (watchers[i].callback) {
					watchers[i].callback(watchers[i].lastValue);
				}
			}
		}
	};

	// Timer
	var timerId = setInterval(checkWatchers, 10);

	// ----- Public methods -----

	this.add = function(val, cb, label) {
		watchers.push({
			watching: val,
			lastValue: getValueOf(val),
			callback: cb,
			label: label
		});
		// Do an initial callback
		cb(getValueOf(val));
	};
};

// ----- SuperWatcher JQuery extension -----

var watcher = new SuperWatcher();

// Dynamically modify a CSS property when function result changes
$.fn.reactiveCss = function(prop, func) {
	// Currying the $.css method
	watcher.add(func.bind(this), this.css.bind(this, prop), prop);
	// For function chaining
	return this;
};
