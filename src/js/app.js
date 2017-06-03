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

let filter;
let currentLocations;
let map;
let markers = [];
let infoWindow = null;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 11,
      center: {lat: 53.0160, lng: -9.355},
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

  markers.push(marker);

  marker.addListener('click', function() {
    showInfoWindow(marker, content);
  });
}

function mapViewModel() {

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
  }, mapViewModel);

  // filtering locations should also filter markers on the map
  currentLocations.subscribe(function() {
    filterMarkers();
  });

  // clicking on location name opens infowindow
  showLocation = function(location) {
    showInfoWindow(markers[location.index], location.wikiContent);
  }
}

function filterMarkers() {
  for (let i = 0; i < markers.length; i++) {
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

function getWikiData(location, addMarker) {
  let wikiSummaryUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" +
    location.name + "&format=json";

  let wikiImageUrl = "https://en.wikipedia.org/w/api.php?action=query&formatversion=2" +
    "&prop=pageimages&piprop=thumbnail&pithumbsize=250&titles=" +
    location.name + "&format=json";

  let imageSource;

   $.ajax({
    url: wikiSummaryUrl,
    dataType: "jsonp",
    success: function(response) {
      let wikiContent = response[2][0];
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

function mapError() {
  alert("Map was unable to load. Please try again.");
}

// Activates knockout.js
ko.applyBindings(new mapViewModel());
