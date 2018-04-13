import errorsList from './errors';

var politicalOptions = {" ":" ",
                        "specific-locale":"Specific Locale",
                        "city":"City / Town / Hamlet",
                        "county":"County",
                        "dept":"Department / State",
                        "country":"Country",
                        "continent":"Continent"};
var naturalOptions = {" ":" ",
                      "ocean":"Ocean",
                      "sea":"Sea / Gulf / Strait",
                      "lake":"Lake / Pond / Reservoir",
                      "bay":"Bay / Harbor",
                      "river":"River / Creek",
                      "stream":"Stream",
                      "island-group":"Island Group",
                      "island":"Island",
                      "mtn-range":"Mountain Range",
                      "mtn":"Mountain"};

const initListeners = () => {
  // on cancel, hide dialog
  $('#autopopulate_cancel').click(function() {
    $('#location_autocomplete_dialog').addClass("u-hidden");
  });

  $('#autopopulate_ok').click(function() {
    // for each dialog autoselect box
    var children = document.querySelectorAll('#autocomplete_list select');
    for (var i=0; i < children.length; i++) {
      var option = children[i].value;
      if (option != ' ') {
        if (option == 'country') {
          $('#country').val(children[i].dataset.shortName);
        }
        else {
          $(`#${option}`).val(children[i].dataset.longName)
        }
      }
    }

    $('#location_autocomplete_dialog').addClass("u-hidden");
  });
}

const initMap = () => {
  var map = new google.maps.Map(document.getElementById('location-map'), {
    zoom: 3,
    center: {lat: .433014, lng: 0.752724 }
  });

  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  var textInput = document.getElementById('location-autocomplete');
  var searchBox = new google.maps.places.SearchBox(textInput);
  var searchButton = document.getElementById('location-go');

  // Called when user picks one of the autocomplete options
  searchBox.addListener('places_changed', function() {
    updateLocationSection(searchBox.getPlaces());
  });

  // Called when user clicks on Go! button or presses enter in the searchbox
  searchButton.addEventListener('click', function() {
    const placesService = new google.maps.places.PlacesService(map);
    var searchTerm = textInput.value;
    var request = {query: searchTerm};

    return new Promise(function() {
      placesService.textSearch(request, function(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          updateLocationSection(results);
        }
        else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          window.alert(errorsList.noPlacesFound);
        }
        else {
          console.log(errorsList.googleMapsError + status);
        }
      });
    });
  });


  /**
   * Take the results returned by Google Maps and update the components of the
   * Locations section that we now have information about
   * @param {google.maps.places.Place} places
   */
  function updateLocationSection(places) {
    if (places.length == 0) {
      window.alert(errorsList.noPlacesFound);
      return;
    }
    updateMap(places[0]);
    updateVerbatimAddress(textInput.value);
    updateLatLong(places[0]);
    displayAutocompleteDialog(places[0]);
  }

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
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
  }
}

/**
 * Update the Verbatim Location/Adress field with the user input from the Location search box
 * @param {string} input
 */
const updateVerbatimAddress = (input) => {
  document.getElementById('verbatim-address').value = input;
}

/**
 * Updates the Latitude and Longitude inputs of the place object returned by
 * by Google Maps
 * @param {google.maps.places.Place} place
 */
const updateLatLong = (place) => {
  document.getElementById('lat-from').value = place.geometry.location.lat().toFixed(3);
  document.getElementById('lat-to').value = place.geometry.location.lat().toFixed(3);
  document.getElementById('lon-to').value = place.geometry.location.lng().toFixed(3);
  document.getElementById('lon-from').value = place.geometry.location.lng().toFixed(3);
}

/**
 * Given the different address components (country, state, city, etc) of a place or a natural
 * place, create a dialog for the user to designate which component is which
 * @param {google.maps.places.Place} place
 */
const displayAutocompleteDialog = (place) => {
  var addressComponents = [];

  /* If the user uses autocomplete to input a place, Google will return a more detailed
    address_components attribute on the place object. If a place is returned by a
    text search, there is no address_components so we will make our own.*/
  if (place.address_components) {
    addressComponents = place.address_components;
  }
  else {
    let placeAttributes = {
      'long_name': place.name,
      'short_name': place.name,
      'types': place.types
    };

    addressComponents.push(placeAttributes);
  }
  const dialog = $('#autocomplete_list');
  dialog.empty();       // clear out dialog of old dropdowns

  // populate dialog
  createDropdowns(dialog, addressComponents);

  $('#location_autocomplete_dialog').removeClass("u-hidden");  // display dialog
}

/**
 * Create a dropdown for each of the given address components and add it to the
 * give dialog box
 * @param {Object} dialog
 * @param {Object} addressComponents
 */
const createDropdowns = (dialog, addressComponents) => {
  for (var i=0; i < addressComponents.length; i++) {
    var item = addressComponents[i];
    var type = item.types[0];
    var itemHtml = `<fieldset class="c-form__fieldset u-separator-xs">
      <label class="c-label " for="">${item.long_name} is a</label>
      <select data-long-name="${item.long_name}" data-short-name="${item.short_name}"
      placeholder="Select input" class="c-input c-input--square c-input--select "></select>
    </fieldset>`;

    var dropdown = $(itemHtml);
    var options = type == 'natural_feature'
                    ? naturalOptions : politicalOptions;

    addOptions(dropdown, options);
    selectOption(dropdown, options, type);

    dialog.append(dropdown);
  }
}

/**
 * Based on whether the given place component is an address or natural landmark,
 * populate the dropdown with the appropriate options
 * @param {google.maps.places.Place} place
 */
const addOptions = (dropdown, options) => {
  var select = dropdown.find('select:first')[0];

  var keys = Object.keys(options);
  for (var i = 0; i < keys.length; i++) {
      var option = document.createElement("option");
      option.value = keys[i];
      option.text = options[keys[i]];
      select.appendChild(option);
  }
}

/**
 * If type is one of the options of the dropdown, select that option
 * @param {Object} dropdown
 * @param {Object} options
 * @param {string} type
 */
const selectOption = (dropdown, options, type) => {
  var optionType = dropdown.find(`[value="${type}"]`)[0];
  if (optionType != null) {
    optionType.selected = true;
  }
}

initListeners();
initMap();