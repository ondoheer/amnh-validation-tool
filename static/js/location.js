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

const onLocationGo = (geoComponents) => {
  // console.log(addressComponents);
  // initiate political and natural feature dialog flow
  initDialogFlow(geoComponents.types)
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

  var geocoder = new google.maps.Geocoder;
  var infowindow = new google.maps.InfoWindow;

  function updateMap(places) {
    if (places.length == 0) {
      window.alert("No details about the place you searched for");
      return;
    }
    marker.setVisible(false);

    /* Depending on the search Google will return more than one place. We are
      choosing to display the first result (hopefully the most relevent) in the
      list of places returned. */
    place = places[0];

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    if (place.address_components) {
      var addrComponents = {}
      addrComponents.types = place.address_components;
      addrComponents.lat = place.geometry.location.lat();
      addrComponents.lng = place.geometry.location.lng();
    }
  }

  var textInput = document.getElementById('location-autocomplete');
  var searchBox = new google.maps.places.SearchBox(textInput);
  var searchButton = document.getElementById('location-go');

  searchButton.addEventListener('click', function() {
    service = new google.maps.places.PlacesService(map);
    var searchTerm = textInput.value;

    request = {query: searchTerm}
    service.textSearch(request, updateMap);
  });

  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    updateMap(places);
  });

  function geocodeLatLng(latLng, geocoder, map, infowindow) {

  }

  map.addListener('click', function(e) {
    console.log(e.latLng);
    geocoder.geocode({'location': e.latLng}, function(results, status) {
      console.log(results);
    })
  });
}

const initDialogFlow = (addressMap) => {
  // show dialog
  $('#location_autocomplete_dialog').removeClass("u-hidden");

  // clear out dialog of old dropdowns
  var dialog = $('#autocomplete_list');
  dialog.empty();

  // populate dialog
  createDropdowns(dialog, addressMap);

  // on ok, populate fields
  $('#autocomplete_ok').click(function() {

  });
}

// create dropdowns for each entry in address map
const createDropdowns = (dialog, addressMap) => {
  for (var i=0; i < addressMap.length; i++) {
    var item = addressMap[i];
    var type = item.types[0];
    var itemHtml = `<fieldset class="c-form__fieldset u-separator-xs">
      <label class="c-label " for="">${item.long_name} (${type}) is a</label>
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

// add options to select view
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

// if type is one of the options, select that option
const selectOption = (dropdown, options, type) => {
  var optionType = dropdown.find(`[value="${type}"]`)[0];
  if (optionType != null) {
    optionType.selected = true;
  }
}

// createLocationFinder($('#location-autocomplete'));
initListeners();
// thing 1: recenter on map Marker
initMap();