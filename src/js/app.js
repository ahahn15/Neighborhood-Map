var locations = [
  {
    name:'Cliffs of Moher',
    lat: 52.9719,
    lng: -9.4265,
    index: 0,
    wikiContent: ""
  },
  {
    name:'Inishmaan',
    lat: 53.0855,
    lng: -9.5860,
    index: 1,
    wikiContent: ""
  },
  {
    name:'O\'Brien\'s Tower',
    lat: 52.9730,
    lng: -9.4305,
    index: 2,
    wikiContent: ""
  },
  {
    name:'Ballinalacken Castle',
    lat: 53.0461,
    lng: -9.3404,
    index: 3,
    wikiContent: ""
  },
  {
    name:'Doolin Cave',
    lat: 53.0433,
    lng: -9.3447,
    index: 4,
    wikiContent: ""
  },
  {
    name:'The Burren',
    lat: 53.0078,
    lng: -9.0021,
    index: 4,
    wikiContent: ""
  },
  {
    name:'Poulnabrone Dolmen',
    lat: 53.0487,
    lng: -9.1401,
    index: 4,
    wikiContent: ""
  }]

var filter;
var currentLocations;
var map;
var markers = [];
var infoWindow = null;

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 11,
      center: {lat: 53.0160, lng: -9.355},
      mapTypeId: 'roadmap'
    });

    // get wiki data and create marker for each location
    for (var i = 0, l = locations.length; i < l; i++) {
      getWikiData(locations[i]);
      addMarker(locations[i]);
    }
 }

function addMarker(location) {
    var title = location.name;
    var lat = location.lat;
    var lng = location.lng;
    var content = location.wikiContent;

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      map: map,
      title: title
    });

    markers.push(marker);

    google.maps.event.addListener(marker,'click', (function (marker, content) { //?
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
    showInfoWindow(markers[location.index], location.wikiContent);
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

function getWikiData(location) {
  var wikiurl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" +
    location.name + "&format=json";

  $.ajax({
    url: wikiurl,
    dataType: "jsonp",
    success: function(response) {
      let wikiContent = response[2][0];
      let contentString =
      '<div id="content">'+
        '<h1>' + location.name + '</h1>'+
        '<p>' + wikiContent + '</p>'+
      '</div>';
      location.wikiContent = contentString;
    },
    error: function() {
      alert("An error occurred loading Wikipedia content. Please try again.");
    }
  });
}

function mapError() {
  alert("Map was unable to load. Please try again.");
}

// Activates knockout.js
ko.applyBindings(new mapViewModel());
