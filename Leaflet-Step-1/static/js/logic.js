// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("map", {
    center: [20,0],
    zoom: 3
  });
  
// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson'


var newIcon = L.icon({
    iconUrl: 'dot.png',
    iconSize:     [38, 95], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

function markerSize(mag) {
    return (mag**3)*1500;
};

function markerColor(depth) {
    if (depth < 50) {
        return "#00FF00"
    } else if (depth <100) {
        return "#80FF00"
    } else if (depth <150) {
        return "#FFFF00"
    } else if (depth < 200) {
        return "#FF8000"
    } else {
        return "#FF0000"
    }
};


//Bring in geojson data
d3.json(queryUrl, function(d) {
    var features = d.features
    var featureGroup = L.layerGroup()
    var featureMarker = L.marker()
        
    features.forEach(function (feature) {
        var coords = [feature.geometry.coordinates[1],feature.geometry.coordinates[0]]
        L.circle(coords,{
            stroke: false,
            fillOpacity: .75,
            color: markerColor(feature.geometry.coordinates[2]),
            fillColor: markerColor(feature.geometry.coordinates[2]),
            radius: markerSize(feature.properties.mag)
        }).bindPopup(
            `<ul>
                <li><strong>Location:</strong> ${feature.properties.place}</li>
                <li><strong>Magnitude:</strong> ${feature.properties.mag}</li>
                <li><strong>Depth:</strong> ${feature.geometry.coordinates[2]}</li>
            </ul>`)
        .addTo(myMap)
    })
})


//Add legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var limits = ["<50","50-100","100-150","200","250+"];
  var colors = ["#00FF00","#80FF00","#FFFF00","#FF8000","#FF0000"];
  var labels = [];

  // Add min & max
  var legendInfo = "<h1>Earthquake Depth</h1>" //+
    // "<div class=\"labels\">" +
    //   "<div class=\"min\">" + limits[0] + "</div>" +
    //   "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    // "</div>";

  div.innerHTML = legendInfo;

  limits.forEach(function(limit, index) {
    labels.push("<li style=\"background-color: " + colors[index] + "\">"+limits[index]+"</li>");
  });

  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
};

// Adding legend to the map
legend.addTo(myMap);

