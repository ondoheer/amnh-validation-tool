let addressComponents = {};

const createLocationFinder = (finder) => {
  console.log(finder);
  var autocomplete = new google.maps.places.Autocomplete(finder[0]);
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    addressComponents.types = autocomplete.getPlace().address_components;
    addressComponents.lat = autocomplete.getPlace().geometry.location.lat();
    addressComponents.lng = autocomplete.getPlace().geometry.location.lng();
    console.log(autocomplete.getPlace(), addressComponents);
    // initMap(addressComponents.lat, addressComponents.lng)
    // sessionStorage.setItem(autocomplete.getPlace().formatted_address,JSON.stringify(addressMetta));
    onLocationGo()
  });
}

//todo: fix map so it goes under header
function initMap(lat, lng) {
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
  initDialogFlow()
}

const initDialogFlow = () => {
  
}


console.log("Loading location.js");
createLocationFinder($('#location-autocomplete'));
