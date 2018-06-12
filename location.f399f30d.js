// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({6:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var errors = {
  introIvalidUsername: "Remember to fill in a valid username",
  longFormNoUserName: "You have to enter your Name before entering data",
  addPersonNoVerbatim: "You must enter a Verbatim Name before adding a Person",
  noPlacesFound: "No details about the place you searched for",
  googleMapsError: "Error Status in Google Maps search: ",
  noTaxnomoniesFound: "Worms couldn't find that taxonomy, try searching it by hand "
};

/**
 * Converts a valid html string representation into an html element
 * @param {html string representation} html
 */
var htmlTextToElement = function htmlTextToElement(html) {
  var template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
};

/**
 * Displays an error message and adds the error class to the input field
 */
var showError = exports.showError = function showError(elementId, text) {
  var center = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var centerClass = center ? 'u-align-center' : '';
  var errorTemplate = "<div id=\"Error\" class='c-form__error-label " + centerClass + "' >" + text + "</div>";
  var nameInput = document.getElementById(elementId);

  nameInput.insertAdjacentElement("afterend", htmlTextToElement(errorTemplate));
  nameInput.classList.add("c-input--error");
};

/**
 * Removes the error classes and html elements
 */
var cleanErrors = exports.cleanErrors = function cleanErrors(labelId, inputId) {
  var errorLabel = document.getElementById(labelId);
  var nameInput = document.getElementById(inputId);

  if (errorLabel) {
    errorLabel.remove();
    nameInput.classList.remove("c-input--error");
  }
};

exports.default = errors;
},{}],18:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Adds a style element with the given rule as a child of the given parent element
 * @param {parentId string}
 * @param {rule string}
 */
var addStyleString = exports.addStyleString = function addStyleString(parentId, rule) {
  var parent = document.getElementById(parentId);
  var node = document.createElement("style");
  node.innerHTML = rule;
  parent.appendChild(node);
};

/**
 * Gives a border to all the input fields of the given form
 * @param {formId string}
 */
var addPlaceHolderBorders = exports.addPlaceHolderBorders = function addPlaceHolderBorders(formId) {
  addStyleString(formId, "#" + formId + " input:placeholder-shown {\n                    border: 3px solid #ffa500 !important;\n                  }");
};
},{}],7:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kebabToCamel = kebabToCamel;
function kebabToCamel(str) {
  return str.replace(/(\-[A-Za-z])/g, function (m) {
    return m.toUpperCase().replace('-', '');
  });
}

/**
 * Checks if the input is filled in
 * @param {string} value
 */
var validateName = exports.validateName = function validateName(value) {
  var cleanValue = value.replace(/\s+/g, "");
  if (cleanValue.length === 0) {
    return false;
  }
  return true;
};

/**
 * Removes any children style elements of a given parent node
 * @param {parentId string}
 */
var removeStyleNodes = exports.removeStyleNodes = function removeStyleNodes(parentId) {
  var parent = document.getElementById(parentId);
  var styleNodes = document.querySelectorAll('#' + parentId + ' style');
  styleNodes.forEach(function (element) {
    parent.removeChild(element);
  });
};

/**
 * Reset all the input and select elements to default and remove styles of the given form
 * @param {formId}
 */
var resetForm = exports.resetForm = function resetForm(formId) {
  var elements = document.querySelectorAll('#' + formId + ' input, #' + formId + ' select');
  elements.forEach(function (element) {
    element.value = '';
  });
  removeStyleNodes(formId);
};
},{}],13:[function(require,module,exports) {
"use strict";

var _errors = require("./errors");

var _errors2 = _interopRequireDefault(_errors);

var _css_injector = require("./css_injector");

var _helpers = require("./helpers.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var politicalOptions = {
  " ": " ",
  "specific-locale": "Specific Locale",
  city: "City / Town / Hamlet",
  county: "County",
  dept: "Department / State",
  country: "Country",
  continent: "Continent"
};
var naturalOptions = {
  " ": " ",
  ocean: "Ocean",
  sea: "Sea / Gulf / Strait",
  lake: "Lake / Pond / Reservoir",
  bay: "Bay / Harbor",
  river: "River / Creek",
  stream: "Stream",
  "island-group": "Island Group",
  island: "Island",
  "mtn-range": "Mountain Range",
  mtn: "Mountain"
};

var initListeners = function initListeners() {
  // on cancel, hide dialog
  $("#autopopulate_cancel").click(function () {
    $("#location_autocomplete_dialog").hide();
  });

  $("#autopopulate_ok").click(function () {
    // for each dialog autoselect box

    var children = document.querySelectorAll("#autocomplete_list select");
    for (var i = 0; i < children.length; i++) {
      var option = children[i].value;
      if (option != " ") {
        if (option == "country") {
          $("#country").val(children[i].dataset.shortName);
        } else {
          $("#" + option).val(children[i].dataset.longName);
        }
      }
    }

    $("#location_autocomplete_dialog").hide();
  });
};

var initAutoCompleteDialog = function initAutoCompleteDialog() {
  $("#location_autocomplete_dialog").removeClass("u-hidden");
  $("#location_autocomplete_dialog").hide();
};

var initMap = function initMap() {
  var map = new google.maps.Map(document.getElementById("location-map"), {
    zoom: 3,
    center: { lat: 0.433014, lng: 0.752724 }
  });

  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  var textInput = document.getElementById("location-autocomplete");
  var searchBox = new google.maps.places.SearchBox(textInput);
  var searchButton = document.getElementById("location-go");

  map.addListener("click", function (e) {
    resetLocationsSection();
    placeMarkerAndPanTo(e.latLng, map);
    updateLatLong(e.latLng.lat(), e.latLng.lng());
  });

  // Called when user picks one of the autocomplete options
  searchBox.addListener("places_changed", function () {
    resetLocationsSection();
    updateLocationSection(searchBox.getPlaces());
  });

  // Called when user clicks on Go! button or presses enter in the searchbox
  searchButton.addEventListener("click", function () {
    resetLocationsSection();
    var placesService = new google.maps.places.PlacesService(map);
    var searchTerm = textInput.value;
    var request = { query: searchTerm };

    (0, _errors.cleanErrors)("Error", "searchLocationContainer");

    return new Promise(function () {
      placesService.textSearch(request, function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          updateLocationSection(results);
        } else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          //window.alert(errorsList.noPlacesFound);
          (0, _errors.showError)("searchLocationContainer", _errors2.default.noPlacesFound, false);
        } else {
          console.log(_errors2.default.googleMapsError + status);
        }
      });
    });
  });

  /**
   * Redraw the map with it centered on the given place
   * @param {google.maps.places.Place} place
   */
  function updateMap(place) {
    marker.setVisible(false);
    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17); // Why 17? Because it looks good.
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
  }

  function placeMarkerAndPanTo(latLng, map) {
    marker.setPosition(latLng);
    map.panTo(latLng);
  }

  /**
   * Take the results returned by Google Maps and update the components of the
   * Locations section that we now have information about
   * @param {google.maps.places.Place} places
   */
  function updateLocationSection(places) {
    if (places.length == 0) {
      window.alert(_errors2.default.noPlacesFound);
      return;
    }
    updateMap(places[0]);
    updateLatLong(places[0].geometry.location.lat(), places[0].geometry.location.lng());

    if (places[0].types[0] == "natural_feature") {
      (0, _css_injector.addPlaceHolderBorders)("natural-place-form");
    } else if (places[0].types[0] == "locality") {
      (0, _css_injector.addPlaceHolderBorders)("address-form");
    } else {
      (0, _css_injector.addPlaceHolderBorders)("natural-place-form");
      (0, _css_injector.addPlaceHolderBorders)("address-form");
    }
    displayAutocompleteDialog(places[0]);
  }
};

/**
 * Reset all the forms in the Location section to their defaults
 */
var resetLocationsSection = function resetLocationsSection() {
  (0, _helpers.resetForm)("address-form");
  (0, _helpers.resetForm)("natural-place-form");
  (0, _helpers.resetForm)("lat-long-form");
  $("#location_autocomplete_dialog").hide();
};

/**
 * Given a latitude and a longitude update the relevant lat/long inputs in the Locations form
 * @param {float} lat
 * @param {float} long
 */
var updateLatLong = function updateLatLong(lat, long) {
  document.getElementById("lat-from").value = lat.toFixed(3);
  document.getElementById("lat-to").value = lat.toFixed(3);
  document.getElementById("lon-to").value = long.toFixed(3);
  document.getElementById("lon-from").value = long.toFixed(3);
};

/**
 * Given the different address components (country, state, city, etc) of a place or a natural
 * place, create a dialog for the user to designate which component is which
 * @param {google.maps.places.Place} place
 */
var displayAutocompleteDialog = function displayAutocompleteDialog(place) {
  var addressComponents = [];

  /* If the user uses autocomplete to input a place, Google will return a more detailed
    address_components attribute on the place object. If a place is returned by a
    text search, there is no address_components so we will make our own.*/
  if (place.address_components) {
    addressComponents = place.address_components;
  } else {
    var placeAttributes = {
      long_name: place.name,
      short_name: place.name,
      types: place.types
    };

    addressComponents.push(placeAttributes);
  }
  var dialog = $("#autocomplete_list");
  dialog.empty(); // clear out dialog of old dropdowns

  // populate dialog
  createDropdowns(dialog, addressComponents);

  $("#location_autocomplete_dialog").fadeIn(1000);
};

/**
 * Create a dropdown for each of the given address components and add it to the
 * give dialog box
 * @param {Object} dialog
 * @param {Object} addressComponents
 */
var createDropdowns = function createDropdowns(dialog, addressComponents) {
  for (var i = 0; i < addressComponents.length; i++) {
    var item = addressComponents[i];
    var type = item.types[0];
    var itemHtml = "<fieldset class=\"c-form__fieldset u-separator-xs\">\n      <label class=\"c-label \" for=\"\">" + item.long_name + " is a</label>\n      <select data-long-name=\"" + item.long_name + "\" data-short-name=\"" + item.short_name + "\"\n      placeholder=\"Select input\" class=\"c-input c-input--square c-input--select \"></select>\n    </fieldset>";

    var dropdown = $(itemHtml);
    var options = type == "natural_feature" ? naturalOptions : politicalOptions;

    addOptions(dropdown, options);
    selectOption(dropdown, options, type);

    dialog.append(dropdown);
  }
};

/**
 * Based on whether the given place component is an address or natural landmark,
 * populate the dropdown with the appropriate options
 * @param {google.maps.places.Place} place
 */
var addOptions = function addOptions(dropdown, options) {
  var select = dropdown.find("select:first")[0];

  var keys = Object.keys(options);
  for (var i = 0; i < keys.length; i++) {
    var option = document.createElement("option");
    option.value = keys[i];
    option.text = options[keys[i]];
    select.appendChild(option);
  }
};

/**
 * If type is one of the options of the dropdown, select that option
 * @param {Object} dropdown
 * @param {Object} options
 * @param {string} type
 */
var selectOption = function selectOption(dropdown, options, type) {
  var optionType = dropdown.find("[value=\"" + type + "\"]")[0];
  if (optionType != null) {
    optionType.selected = true;
  }
};

initAutoCompleteDialog();
initListeners();
initMap();
},{"./errors":6,"./css_injector":18,"./helpers.js":7}],80:[function(require,module,exports) {

var OVERLAY_ID = '__parcel__error__overlay__';

var global = (1, eval)('this');
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '33525' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[80,13])
//# sourceMappingURL=/location.f399f30d.map