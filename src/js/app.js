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

function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 11,
      center: {lat: 53.0160, lng: -9.3774},
      mapTypeId: 'roadmap'
    });

    var infoWindow = new google.maps.InfoWindow();
    var marker;

    for (var i = 0, l = locations.length; i < l; i++) {
       marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i]['lat'], locations[i]['lng']),
        map: map,
        title: locations[i]['name']
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
              infoWindow.setContent(locations[i]['name']);
              infoWindow.open(map, marker);
              marker.setAnimation(google.maps.Animation.BOUNCE);
              setTimeout(function(){ marker.setAnimation(null); }, 750);
          }
      })(marker, i));
    }
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
            return location.name.toLowerCase().indexOf(filterTerm) !== -1;
        });
    }
  }, mapViewModel);
}

// Activates knockout.js
ko.applyBindings(new mapViewModel());
