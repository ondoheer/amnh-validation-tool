let addressComponents = {};
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
  // on go, go
  $('#location-go').click(function() {
    onLocationGo();
  });

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

const createLocationFinder = (finder) => {
  var autocomplete = new google.maps.places.Autocomplete(finder[0]);
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    addressComponents.types = autocomplete.getPlace().address_components;
    addressComponents.lat = autocomplete.getPlace().geometry.location.lat();
    addressComponents.lng = autocomplete.getPlace().geometry.location.lng();

    onLocationGo()
  });
}

const onLocationGo = () => {
  if (jQuery.isEmptyObject(addressComponents)) {
    return
  }
  // thing 1: recenter on map Marker
  initMap(addressComponents.lat, addressComponents.lng)
  // initiate political and natural feature dialog flow
  initDialogFlow(addressComponents.types)
}

//todo: fix map so it goes under header
const initMap = (lat, lng) => {
  var center = {lat: lat, lng: lng};
  var map = new google.maps.Map(document.getElementById('location-map'), {
    zoom: 10,
    center: center
  });
  var marker = new google.maps.Marker({
    position: center,
    map: map
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

createLocationFinder($('#location-autocomplete'));
initListeners();
