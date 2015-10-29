// Creates the gservice factory.
// This will be the primary means of interaction with Google Maps

angular.module('gservice', [])
  .factory('gservice', function($http){

    // Initialize Variables
    // ---------------------------------------------------
    // Service our factory will return
    var googleMapService = {};

    // Array of locations obtained from API calls
    var locations = [];

    // Selected location (initialize to center of USA)
    var selectedLat = 39.50;
    var selectedLong = -98.35;

    // Functions
    // ---------------------------------------------------
    // Refresh the Map with new data
    // Functions will take new latitude and longitude coordinates

    googleMapService.refresh = function(latitude, longitude){

      // Clears the holding array of locations
      locations = [];

      // Set the selected lat and long equal to the ones
      // provided on the refresh() call
      selectedLat = latitude;
      selectedLong = longitude;

      // Perfrm an AJAX call to get all of the records in the db
      $http.get('/users').success(function(response){

        // Convert the results into Google Map Format
        locations = convertToMapPoints(response);

        // Then initialize the map
        initialize(latitude, longitude);

      }) // end success(...)
      .error(function(){});

    }; // end googleMapService.refresh = function( ... )

    // Private Inner Functions
    // ---------------------------------------------------
    // Convert a JSON of users into map points

    var convertToMapPoints = function(response){

      // Clear the locations holder
      var locations = [];

      // Loop through all of the JSON entries provided 
      // as response of call to API
      for(var i=0; i < response.length; i++){

        var user = response[i];

        // Create popup windows for each record
        var contentString = 
          '<p><b>Username</b>: ' + user.username +
          '<br><b>Age</b>: ' + user.age +
          '<br><b>Gender</b>: ' + user.gender +
          '<br><b>Favourite Language</b>: ' + user.favlang +
          '</p>';

        // Converts each of the JSON records into Google Maps 
        // Location format
        // (Note: [Lat,Lng] format)
        locations.push({

          latlon: new google.maps.LatLng(user.location[1], user.location[0]),
          message: new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 320
          }),
          username: user.username,
          gender: user.gender,
          age: user.age,
          favlang: user.favlang

        }) // end locations.push()

      } // end for loop over users

      // location is now an array populated with records in Google Maps format
      return locations

    }; // end convertToMapPoints function definition

    // Initializes the map
    var initialize = function(latitude, longitude){
      
      // Uses the selected lat, long as a starting point
      var myLatLong = {lat: selectedLat, lng: selectedLong};

      // If map has not been created already ...
      if (!map) {
        // Create a new map and place it in the index.html page

        var map = new google.maps.Map(document.getElementById('map'),{
          zoom: 3,
          center: myLatLong
        });

      } // end if(!map)

      // Loop through each location in the array and place a marker
      locations.forEach(function(n,i){

        var marker = new google.maps.Marker({
          position: n.latlon,
          map: map,
          title: "Big Map",
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        });

        // For each marker created, add a listener that checks for clicks
        google.maps.event.addListener(marker, 'click', function(e){

          // when clicked, open the selected marker's message
          currentSelectedMarker = n;
          n.message.open(map, marker);

        }); // end google.maps.event.addListener(...,function(e){...

      }); // end locations.forEach(function(...))

      var initialLocation = new google.maps.LatLng(latitude, longitude);
      var marker = new google.maps.Marker({
        position: initialLocation,
        animation: google.maps.Animation.BOUNCE,
        map: map,
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
      });

      lastMarker = marker;

    }; // end var initialize = function(...)

    // Refresh the page upon window load.
    // Use the initial latitude and longitude 
    google.maps.event.addDomListener(window, 'load',
      googleMapService.refresh(selectedLat, selectedLong));

    return googleMapService;

  }); // end .factory('gservice'...)