# jQuery Geolocation Plugin

A really simple plugin to get country data from either HTML5 Geolocation or IP address, depending on the capability of the browser. Please feel free to fork and modify this code to get other levels of information (city, state/province, etc).

## Configure It

Basically, clone this repo or download the minified javascript and go to town. You'll need an [API Key](https://developers.google.com/maps/documentation/javascript/tutorial) to use Google Maps.

## Use It

To use this plugin, simply call `$(window).geolocate( apiKey, countries, callback );`

* `apiKey` - Your Google Maps API key. If you don't have one, it will default to using IP-based geolocation.
* `countries` - An (optional) array of countries you want to check for. It defaults to all countries, but if you just want to check for certain countries (e.g. if you're filtering content on a country basis) then add them here.
* `callback` - An (optional) callback function to execute if it matches a country. **NOTE:** If you specified an array of countries and a user doesn't match to any of them, this won't fire.