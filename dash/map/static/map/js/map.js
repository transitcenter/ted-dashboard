mapboxgl.accessToken = 'pk.eyJ1Ijoid2tsdW1wZW4iLCJhIjoiY2tibWVieXVrMDZrMTJybzZybHlsNHcyaSJ9.4lNjcWenF95KDkvH7trKqg';
const R = 6378
const minStartContextZoom = 10
let currentLayer

// Populate date selector
var dateSelect = document.getElementById("date")

for (var i = 0; i < dateList.length; i++) {
    var opt = dateList[i];
    var el = document.createElement("option");
    el.textContent = opt[1];
    el.value = opt[0];
    if (opt[0] == defaultDate) {
        el.selected = true;
    }
    else {
        el.selected = false;
    }
    dateSelect.appendChild(el)
}

// Initialize basemap
const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/light-v11', // style URL
    center: [-109.4874429, 38.3426943], // starting position [lng, lat]
    zoom: 3.54, // starting zoom
    maxzoom: 10, //maximum zoom
    attributionControl: false
});

// Add custom attribution controls
map.addControl(new mapboxgl.AttributionControl({
    customAttribution: "Proudly built by <a class='text-orange-kc' href='http://klumpentown.com'>klumpentown</a> | <a href='/changelog'>v2.0</a>"
}))

// Create a popup, but don't add it to the map yet.
const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});

var legendBoxHeight = 50
var legendBoxWidth = d3.select("#legend").node().getBoundingClientRect().width

let legendSvg = d3.select("#legend")
    .append('svg')
    .attr("width", legendBoxWidth)
    .attr("height", legendBoxHeight)
    .append('g')
    .attr("transform", "translate(" + legendMargin.left + "," + legendMargin.top + ")");

map.on('load', () => {

    map.addSource('places', {
        // This GeoJSON contains features that include an "icon"
        // property. The value of the "icon" property corresponds
        // to an image in the Mapbox Streets style's sprite.
        'type': 'geojson',
        'data': regions
    });

    // Add the places dot layer.
    map.addLayer({
        'id': 'places',
        'type': 'circle',
        'source': 'places',
        'maxzoom': minStartContextZoom,
        'paint': {
            'circle-color': "#f58426",
            'circle-radius': 6,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#000000'
        }
    });

    regionKeys.forEach(function (region, idx) {
        // map.addSource(region + '-transit', {
        //     // This GeoJSON contains features that include an "icon"
        //     // property. The value of the "icon" property corresponds
        //     // to an image in the Mapbox Streets style's sprite.
        //     'type': 'geojson',
        //     'data': 'mapbox://wklumpen.2t8nsu0h'
        // });

        // map.addLayer({
        //     'id': region + 'transit',
        //     'type': 'line',
        //     'source': region + '-transit',
        //     'layout': {
        //         'line-join': 'round',
        //         'line-cap': 'round'
        //     },
        //     'paint': {
        //         'line-color': '#888',
        //         'line-width': 8
        //     }
        // });
    });

    changeDataSource(defaultDate, defaultTOD)

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'places', (e) => {
        // Copy coordinates array.
        var coords = e.features[0].geometry.coordinates
        coords[0] = coords[0] - 0.10
        map.flyTo({center: coords, zoom: minStartContextZoom})
        setRegionalContext(e.features[0].properties.tag)
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'places', (e) => {
        map.getCanvas().style.cursor = 'pointer';

        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = '<b>' + e.features[0].properties.description + "</b>"

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(description).addTo(map);

    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'places', () => {
        map.getCanvas().style.cursor = '';
        popup.remove()
    });

    // Zoom event to control context-dependent information
    map.on('moveend', () => {
        if ((map.getZoom() < minStartContextZoom)) {
            // Move back to the regional context setting
            setRegionalContext("start")
        }
        else if (map.getZoom() >= minStartContextZoom) {
            // Find out where we are
            var mapCenter = map.getCenter();
            // Get the points layer
            var places = map.getSource('places')._data.features
            let currentDist = 1000;
            let closeToPlace = null;
            // Compute which city we are closest to
            places.forEach((place, i) => {
                var coords = place.geometry.coordinates
                var dlon = (Math.PI / 180) * (mapCenter.lng - coords[0])
                var dlat = (Math.PI / 180) * (mapCenter.lat - coords[1])
                var clat = (Math.PI / 180) * mapCenter.lat
                var dx = R * Math.cos(clat) * dlon
                var dy = R * dlat
                var dist = Math.sqrt(dx * dx + dy * dy)

                if (dist < 75) {
                    if (dist < currentDist) {
                        closeToPlace = place.properties.tag
                    }
                }
            })
            if (closeToPlace != null) {
                setRegionalContext(closeToPlace)
            }
            else {
                setRegionalContext("start")
            }
        }
    });

    function setRegionalContext(region) {
        var contextText = document.getElementById("context")
        var optionsDiv = document.getElementById("options")
        if (region == "start") {
            contextText.innerHTML = "Choose a city marker or zoom into a city to see data."
        }
        else {
            contextText.innerHTML = "Now viewing data for " + regionDetails[region]["name"] + "."
        }
        // currentTextElement.style.display = "none";
        // currentTextElement = document.getElementById(region + "-text");
        //TODO: Fix this
        // currentTextElement.style.display = "inline-block";

        // var options = document.getElementById("options")
        // if (region != "start") {
        //     options.style.visibility = "visible";
        // }
        // else {
        //     options.style.visibility = "hidden";
        // }
    }
});



