var locations = [
  {
    name:'Cliffs of Moher',
    lat: 52.9719,
    lng: -9.4265
  },
  {
    name:'Inishmaan',
    lat: 53.0855,
    lng: -9.5860
  },
  {
    name:'Atlantic View Bed & Breakfast',
    lat: 53.016001,
    lng: -9.377577
  },
  {
    name:'O\'Connors Pub',
    lat: 53.0126,
    lng: -9.3865
  },
  {
    name:'Doolin Caves',
    lat: 53.0433,
    lng: -9.3447
  }]

var filter;
var currentLocations;
var map;
var markers = [];

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 11,
      center: {lat: 53.0160, lng: -9.3774},
      mapTypeId: 'roadmap'
    });

    for (var i = 0, l = locations.length; i < l; i++) {
      addMarker(locations[i]);
    }
 }

function addMarker(location) {
  var title = location.name;
  var lat = location.lat;
  var lng = location.lng;
  var content = location.name;

  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    map: map,
    title: title
  });

  markers.push(marker);

  var infoWindow = new google.maps.InfoWindow();
  google.maps.event.addListener(marker, 'click', (function (marker, content) {
      return function () {
          infoWindow.setContent(content);
          infoWindow.open(map, marker);
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function(){ marker.setAnimation(null); }, 750);
      }
  }));
}

function mapViewModel() {

  filter = ko.observable("");

  // Array of locations based on search input (case insensitive)
  currentLocations = ko.computed(function() {
    var filterTerm = filter().toLowerCase();
    if (!filterTerm) {
        return locations;
    } else {
        return ko.utils.arrayFilter(locations, function(location) {
          if (location.name.toLowerCase().indexOf(filterTerm) !== -1) {
            location.visible = true;
            return true;
          } else {
            location.visible = false;
            return false;
          }
        });
    }
  }, mapViewModel);

  currentLocations.subscribe(function() {
    filterMarkers();
  });
}

function filterMarkers() {
  for (i = 0; i < markers.length; i++) {
    marker = markers[i];
    if (locations[i].visible) {
      marker.setVisible(true);
    } else {
      marker.setVisible(false);
    }
  }
}

// Activates knockout.js
ko.applyBindings(new mapViewModel());
