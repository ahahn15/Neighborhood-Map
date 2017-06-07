let locations = [
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
    index: 5,
    wikiContent: ""
  },
  {
    name:'Ailladie',
    lat: 53.0731,
    lng: -9.3549,
    index: 6,
    wikiContent: ""
  }];

let filter;
let currentLocations;
let map;
let markers = [];
let infoWindow = null;
let mapCenter = {lat: 53.0160, lng: -9.346};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 11,
      center: mapCenter,
      mapTypeId: 'roadmap'
    });

    // get wiki data and create marker for each location
    for (let i = 0, l = locations.length; i < l; i++) {
      getWikiData(locations[i], addMarker);
    }
}

function addMarker(location) {
  let title = location.name;
  let lat = location.lat;
  let lng = location.lng;
  let content = location.wikiContent;

  let marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    map: map,
    title: title
  });

  // hold location indexes on markers
  marker.locationIndex = location.index;
  markers.push(marker);

  marker.addListener('click', function() {
    showInfoWindow(marker, content);
  });
}

function MapViewModel() {

  filter = ko.observable("");

  // filter list of locations based on search input (case insensitive)
  currentLocations = ko.computed(function() {
    let filterTerm = filter().toLowerCase();
    if (!filterTerm) {
      for (let i = 0, l = locations.length; i < l; i++) {
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
  }, MapViewModel);

// filtering locations should also filter markers on the map
currentLocations.subscribe(function() {
  if (infoWindow) {
    infoWindow.close();
  }
  filterMarkers();
});

// clicking on location name opens infowindow
showLocation = function(location) {
  marker = $.grep(markers, function(marker){ return marker.locationIndex === location.index; });
  showInfoWindow(marker[0], location.wikiContent);
  };
}

function filterMarkers() {
  map.panTo(mapCenter);
  let locationIndex;
  for (let i = 0; i < markers.length; i++) {
     locationIndex = markers[i].locationIndex;
    if (locations[locationIndex].visible) {
      markers[i].setVisible(true);
    } else {
      markers[i].setVisible(false);
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
  setTimeout(function(){ marker.setAnimation(null); }, 700);
  infoWindow.open(map, marker);
  map.panTo(marker.getPosition());
}

function getWikiData(location, addMarker) {
  let wikiSummaryUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" +
    location.name + "&format=json";

  let wikiImageUrl = "https://en.wikipedia.org/w/api.php?action=query&formatversion=2" +
    "&prop=pageimages&piprop=thumbnail&pithumbsize=250&titles=" +
    location.name + "&format=json";

  let imageSource;
  // call wikipedia API for summary content
  $.ajax({
    url: wikiSummaryUrl,
    dataType: "jsonp",
    success: function(response) {
      let wikiContent = response[2][0];
      let wikiArticleUrl = response[3][0];
      // if wikipedia summary call is successful, get image
      $.ajax({
        url: wikiImageUrl,
        dataType: "jsonp",
        success: function(response) {
          if(response.query.pages[0].hasOwnProperty("thumbnail") === true) {
            imageSource = response.query.pages[0].thumbnail.source;

            let contentString =
            '<div>'+
              '<h1>' + location.name + '</h1>'+
              '<p>' + wikiContent + '</p>'+
              '<div class="image-container">' +
                '<img class="image" src='+ imageSource +'>' +
              '</div>' +
              '<a href="' + wikiArticleUrl + '" target="_blank">Go to Wikipedia</a>' +
            '</div>';

            location.wikiContent = contentString;
          }
          addMarker(location);
        },
        error: function() {
          alert("An error occurred loading Wikipedia images. Please try again.");
        }
      });
    },
    error: function() {
        alert("An error occurred loading Wikipedia content. Please try again.");
    }
  });
}

function toggleSidebar() {
  console.log('toggling');
  var x = document.getElementById("filter-column");
  if (x.className === "topnav") {
      x.className += " responsive";
  } else {
      x.className = "topnav";
  }
}

function onMapLoadError() {
  alert("Google maps failed to load at this time. Please try again.");
}

// Activates knockout.js
ko.applyBindings(new MapViewModel());
