let addressComponents = {};
var politicalOptions = [" ","Specific Locale", "City / Town / Hamlet", "County", "Department", "Country", "Continent"];
var naturalOptions = [" ","Ocean","Sea / Gulf / Strait","Lake / Pond / Reservoir","Bay / Harbor","River / Creek","Stream","Island Group","Island","Mountain Range","Mountain"];

const createLocationFinder = (finder) => {
  console.log(finder);
  var autocomplete = new google.maps.places.Autocomplete(finder[0]);
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    addressComponents.types = autocomplete.getPlace().address_components;
    addressComponents.lat = autocomplete.getPlace().geometry.location.lat();
    addressComponents.lng = autocomplete.getPlace().geometry.location.lng();
    console.log(autocomplete.getPlace(), addressComponents);

    onLocationGo()
  });
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

const onLocationGo = () => {
  if (jQuery.isEmptyObject(addressComponents)) {
    return
  }
  // thing 1: recenter on map Marker
  initMap(addressComponents.lat, addressComponents.lng)
  // initiate political and natural feature dialog flow
  initDialogFlow(addressComponents.types)
}

const initListeners = () => {
  // on go, go
  $('#location-go').click(function() {
    onLocationGo();
  });

  // on cancel, hide dialog
  $('#autopopulate_cancel').click(function() {
    $('#location_autocomplete_dialog').hide();
  });
}

const initDialogFlow = (addressMap) => {
  // show dialog
  $('#location_autocomplete_dialog').show();

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
    var itemHtml = '<fieldset class="c-form__fieldset u-separator-xs">'+
      '<label class="c-label " for="">'+item.long_name+' ('+type+') is a</label>'+
      '<select placeholder="Select input" class="c-input c-input--square c-input--select "></select>'+
    '</fieldset>';

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

  for (var i = 0; i < options.length; i++) {
      var option = document.createElement("option");
      option.value = options[i];
      option.text = options[i];
      select.appendChild(option);
  }
}

// if type is one of the options, select that option
const selectOption = (dropdown, options, type) => {
  var indexOfOption = options.map(v => v.toLowerCase()).indexOf(type);
  if (indexOfOption != -1) {
    var optionType = dropdown.find('select:first :nth-child('+(indexOfOption+1)+')')[0];
    if (optionType != null) {
      optionType.selected = true;
    }
  }
}

console.log("Loading location.js");
createLocationFinder($('#location-autocomplete'));
initListeners();
