// Store our API endpoint inside queryUrl
var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson';

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup('<h3>' + feature.properties.place +
            '</h3><hr><p>' + feature.properties.mag + '</p>');
    }
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: popplaces_marker
    });
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function popplaces_marker(feature, latlng) {
    var magn = Math.round(feature.properties.mag);
    console.log(magn);
    switch (magn) {
        case 4:
            var f_color = '#ffcc00';
            break;
        case 5:
            var f_color = '#ff9933';
            break;
        case 6:
            var f_color = '#ff6600';
            break;
        case 7:
            var f_color = '#ff5050';
            break;
        case 8:
            var f_color = '#ff0000';
            break;
    };
    console.log(f_color);
    return L.circleMarker(latlng, {
        radius: feature.properties.mag * 3,
        fillColor: f_color,
        color: f_color,
        weight: 1,
        opacity: 1.0,
        fillOpacity: 0.8
    })
}

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\'https://www.openstreetmap.org/\'>OpenStreetMap</a> contributors, <a href=\'https://creativecommons.org/licenses/by-sa/2.0/\'>CC-BY-SA</a>, Imagery © <a href=\'https://www.mapbox.com/\'>Mapbox</a>',
        maxZoom: 11,
        id: 'mapbox.streets-basic',
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\'https://www.openstreetmap.org/\'>OpenStreetMap</a> contributors, <a href=\'https://creativecommons.org/licenses/by-sa/2.0/\'>CC-BY-SA</a>, Imagery © <a href=\'https://www.mapbox.com/\'>Mapbox</a>',
        maxZoom: 11,
        id: 'mapbox.dark',
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        'Street Map': streetmap,
        'Dark Map': darkmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map('map', {
        center: [
            19.4193295, -99.178831
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}