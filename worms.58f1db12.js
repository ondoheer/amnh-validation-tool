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
},{}],9:[function(require,module,exports) {
"use strict";

var _errors = require("./errors");

var _errors2 = _interopRequireDefault(_errors);

var _css_injector = require("./css_injector");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var button = document.getElementById("worms");
button.addEventListener("click", getSearchInfo);

function getFormInfo() {
  var elSpecies = document.getElementById("species");
  var elGenus = document.getElementById("genus");
  var species = elSpecies.value;
  var genus = elGenus.value;
  getWorms(genus, species);
  document.getElementById("loading-state").classList.add("active");
}

function cleanFields() {
  var fields = document.querySelectorAll("#taxForm input:not([type='search'])");
  for (var i = 0; i < fields.length; i++) {
    fields[i].value = "";
  }
}

function getSearchInfo() {
  var searchBox = document.getElementById("taxonomy-search").value.split(" ");

  var genus = searchBox[0];
  var species = searchBox[1];
  var spinner = document.getElementById("whales-spinner");
  spinner.classList.remove("u-hidden");
  document.getElementById("taxForm").classList.add("u-hidden");
  getWorms(genus, species);
}

function getWorms(genus, species) {
  var url = species ? "http://www.marinespecies.org/rest/AphiaRecordsByMatchNames?scientificnames%5B%5D=" + genus + "%20" + species + "&marine_only=true" : "http://www.marinespecies.org/rest/AphiaRecordsByMatchNames?scientificnames%5B%5D=" + genus + "&marine_only=true";

  (0, _errors.cleanErrors)("Error", "searchTaxContainer");
  cleanFields();
  fetch(url).then(function (response) {
    document.getElementById("whales-spinner").classList.add("u-hidden");
    document.getElementById("taxForm").classList.remove("u-hidden");
    return response.json();
  }).then(function (json) {
    displayResponse(json);
    (0, _css_injector.addPlaceHolderBorders)("taxonomy-data");
  }).catch(function (error) {
    // when there aren't results,it just returns an empty response
    // and triggers an error
    console.error(error);

    // clean just inc ase, there was a double error issue # 88
    (0, _errors.cleanErrors)("Error", "searchTaxContainer");
    (0, _errors.showError)("searchTaxContainer", _errors2.default.noTaxnomoniesFound, false);
    updateiFrameDisplay("http://www.marinespecies.org/aphia.php?p=search");
  });
}

function displayResponse(response) {
  response[0].map(function (item) {
    for (var prop in item) {
      // if form field exists, fill in with data from API
      var field = document.getElementById(prop);
      if (field) {
        field.value = item[prop];
        field.classList.add("dynamic");
      }
      if (prop == "url") {
        updateiFrameDisplay(item[prop]);
      }
    }
  });
}

function updateiFrameDisplay(url) {
  var iframe = document.getElementById("worms-iframe");
  iframe.src = url;
}
},{"./errors":6,"./css_injector":18}],80:[function(require,module,exports) {

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
},{}]},{},[80,9])
//# sourceMappingURL=/worms.58f1db12.map