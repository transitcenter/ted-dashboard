mapboxgl.accessToken = 'pk.eyJ1Ijoid2tsdW1wZW4iLCJhIjoiY2tibWVieXVrMDZrMTJybzZybHlsNHcyaSJ9.4lNjcWenF95KDkvH7trKqg';
const R = 6378
const minStartContextZoom = 9
let currentLayer
// Initialize basemap
const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/light-v11', // style URL
    center: [-72.1095703, 38.3426943], // starting position [lng, lat]
    zoom: 3.54, // starting zoom
    attributionControl: false
});

// Add custom attribution controls
map.addControl(new mapboxgl.AttributionControl({
    customAttribution: "Proudly built by <a class='text-orange-kc' href='http://klumpentown.com'>klumpentown</a> | v2.0"
}))

// Create a popup, but don't add it to the map yet.
const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});

map.on('load', () => {
    map.addSource('places', {
        // This GeoJSON contains features that include an "icon"
        // property. The value of the "icon" property corresponds
        // to an image in the Mapbox Streets style's sprite.
        'type': 'geojson',
        'data': regions
    });

    map.addSource('scoreSource', {
        type: 'vector',
        url: 'mapbox://wklumpen.1jsst2v3'
    });

    styles = mapStyles["tsi"]
    map.addLayer(
        {
            'id': 'scoreLayer',
            'type': 'fill',
            'source': 'scoreSource',
            'minzoom': 1,
            'source-layer': 'nyc_was_test-6rqz5h',
            "paint": {
                "fill-color": [
                    'step',
                    ['get', 'WEDAM'],
                    styles["colors"][0],
                    styles["breaks"][0],
                    styles["colors"][1],
                    styles["breaks"][1],
                    styles["colors"][2],
                    styles["breaks"][2],
                    styles["colors"][3],
                ],
                "fill-opacity": 0.8,
            }
        },
        'road-label-simple' // Add layer below labels
    );

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

    let currentTextElement = document.getElementById("start-text")

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'places', (e) => {
        // Copy coordinates array.
        var coords = e.features[0].geometry.coordinates
        coords[0] = coords[0] + 0.15
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
        if ((map.getZoom() < minStartContextZoom) & (currentTextElement.id != "start-text")) {
            setRegionalContext("start")
            console.log("Moved to broad context")
        }
        else if (map.getZoom() >= 10) {
            // Find out where we are
            var mapCenter = map.getCenter();
            // Get the points layer
            var places = map.getSource('places')._data.features
            let currentDist = 1000;
            let closeToPlace = null;
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
    })

    function setRegionalContext(region) {
        currentTextElement.style.display = "none";
        currentTextElement = document.getElementById(region + "-text");
        currentTextElement.style.display = "inline-block";

        var options = document.getElementById("options")
        if (region != "start") {
            options.style.visibility = "visible";
        }
        else {
            options.style.visibility = "hidden";
        }
    }


});

function dateChanged(selectedDate) {
    var dateSelected = parseInt(selectedDate.value)
    console.log(dateSelected)
    newTilesetID = dateSource[dateSelected]["tilesetID"]
    newSourceName = dateSource[dateSelected]["sourceName"]

    map.removeLayer("scoreLayer")
    map.removeSource("scoreSource")

    styles = mapStyles["tsi"]

    map.addSource('scoreSource', {
        type: 'vector',
        url: 'mapbox://' + newTilesetID
    });

    map.addLayer(
        {
            'id': 'scoreLayer',
            'type': 'fill',
            'source': 'scoreSource',
            'minzoom': 1,
            'source-layer': newSourceName,
            "paint": {
                "fill-color": [
                    'step',
                    ['get', 'WEDAM'],
                    styles["colors"][0],
                    styles["breaks"][0],
                    styles["colors"][1],
                    styles["breaks"][1],
                    styles["colors"][2],
                    styles["breaks"][2],
                    styles["colors"][3],
                ],
                "fill-opacity": 0.8,
            }
        },
        'road-label-simple' // Add layer below labels
    );
}

