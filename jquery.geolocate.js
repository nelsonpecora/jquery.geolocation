(function($) {
    $.fn.geolocate = function(geoArray, apiKey, callback) {
        var setCookie = function(cookieName, cookieValue, nDays) {
                var today = new Date();
                var expire = new Date();
                if (nDays === null || nDays === 0) nDays = 1;
                expire.setTime(today.getTime() + 3600000 * 24 * nDays);
                document.cookie = cookieName + '=' + cookieValue + ';expires=' + expire.toGMTString() + '; path=/';
            },
            readCookie = function(cookieName) {
                var re = new RegExp('[; ]' + cookieName + '=([^\\s;]+)');
                var sMatch = (' ' + document.cookie).match(re);
                if (cookieName && sMatch) return sMatch[1];
                return false;
            },
            isGeoCookie = readCookie('mycountry');

        if((isGeoCookie === false) || (isGeoCookie.length < 1)) { //if there isn't a cookie already set, find the location
            var geoRegion,
                geoLat,
                geoLong;

            if (navigator.geolocation && apiKey) {
                $.getScript('https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&sensor=true').done(function() {
                    var timeoutVal = 10000;

                    function displayPosition(position) {
                        geoLat = position.coords.latitude;
                        geoLong = position.coords.longitude;

                        // match the region
                        var geocoder = new google.maps.Geocoder(),
                            latlng = new google.maps.LatLng(geoLat,geoLong);

                        geocoder.geocode({'latLng': latlng}, function(results, status) {
                            if (status === google.maps.GeocoderStatus.OK) {
                                var i = results.length-1;
                                var geoCountry = results[i].formatted_address;

                                if(geoArray && typeof(geoArray) === 'array') {
                                    for (var ii = 0, ll = geoArray.length; ii < ll; ii++) {
                                        if (geoCountry === geoArray[ii]) {
                                            geoRegion = geoCountry;
                                            break;
                                        }
                                    }
                                } else geoRegion = geoCountry;
                                if(!geoRegion) {
                                    return false;
                                } else {
                                    // set cookie
                                    setCookie('mycountry',geoRegion,14);
                                    if(callback) callback();
                                }
                            } else {
                                alert("Region lookup failed due to: " + status);
                            }
                        });
                    }
                    function displayError(error) {
                      var errors = {
                        1: 'Permission denied',
                        2: 'Position unavailable',
                        3: 'Request timeout'
                      };
                      alert("Error: " + errors[error.code]);
                    }
                    navigator.geolocation.getCurrentPosition(
                        displayPosition,
                        displayError,
                        { timeout: timeoutVal, maximumAge: 0 }
                    );
                }).fail(function() { alert('Error retrieving location from Google Maps.'); });
            } else {
                // get geolocation the old fashioned way (fallback to IP-lookup)
                $.getScript('http://j.maxmind.com/app/country.js').done(function() {
                    var countryName = geoip_country_name();
                    if(geoArray && typeof(geoArray) === 'array') {
                        for (var ii = 0, ll = geoArray.length; ii < ll; ii++) {
                            if (countryName === geoArray[ii]) {
                                geoRegion = countryName;
                                break;
                            }
                        }
                    } else geoRegion = countryName;
                    if(!geoRegion) {
                        return false;
                    } else {
                        // set cookie
                        window.setCookie('mycountry',geoRegion,14);
                        if(callback) callback();
                    }
                }).fail(function() { alert('Error retrieving location from IP Address'); });
            }
        } else {
            //if there is a cookie, don't do anything.
            if(callback) callback();
        }
    }
}(jQuery));
