var locations = [
  {
    name:'Cliffs of Moher',
    lat: 52.9719,
    lng: -9.4265,
    index: 0
  },
  {
    name:'Inishmaan',
    lat: 53.0855,
    lng: -9.5860,
    index: 1
  },
  {
    name:'Atlantic View Bed & Breakfast',
    lat: 53.016001,
    lng: -9.377577,
    index: 2
  },
  {
    name:'O\'Connors Pub',
    lat: 53.0126,
    lng: -9.3865,
    index: 3
  },
  {
    name:'Doolin Caves',
    lat: 53.0433,
    lng: -9.3447,
    index: 4
  }]

var filter;
var currentLocations;
var map;
var markers = [];
var infoWindow = null;

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

     var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h1 id="firstHeading" class="firstHeading">' + title + '</h1>'+
    '<div id="bodyContent">'+
    '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
    'sandstone rock formation in the southern part of the '+
    'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
    'south west of the nearest large town, Alice Springs; 450&#160;km '+
    '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
    'features of the Uluru - Kata Tjuta National Park. Uluru is '+
    'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
    'Aboriginal people of the area. It has many springs, waterholes, '+
    'rock caves and ancient paintings. Uluru is listed as a World '+
    'Heritage Site.</p>'+
    '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
    'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
    '(last visited June 22, 2009).</p>'+
    '</div>'+
    '</div>';

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      map: map,
      title: title
    });

    markers.push(marker);

    google.maps.event.addListener(marker,'click', (function (marker, content) {
        return function () {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){ marker.setAnimation(null); }, 750);
            showInfoWindow(marker, content);
        }
    })(marker, content));
}

function mapViewModel() {

  filter = ko.observable("");

  // Array of locations based on search input (case insensitive)
  currentLocations = ko.computed(function() {
    var filterTerm = filter().toLowerCase();
    if (!filterTerm) {
      for (var i = 0, l = locations.length; i < l; i++) {
        locations[i].visible = true;
      }
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

  showLocation = function(location) {
    showInfoWindow(markers[location.index], location.name);
  }
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

function showInfoWindow(marker, content) {
  if (infoWindow) {
    infoWindow.close();
  }
  infoWindow = new google.maps.InfoWindow();
  infoWindow.setContent(content);
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function(){ marker.setAnimation(null); }, 750);
  infoWindow.open(map, marker);
}

// Activates knockout.js
ko.applyBindings(new mapViewModel());
