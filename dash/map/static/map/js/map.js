mapboxgl.accessToken = 'pk.eyJ1Ijoid2tsdW1wZW4iLCJhIjoiY2tibWVieXVrMDZrMTJybzZybHlsNHcyaSJ9.4lNjcWenF95KDkvH7trKqg';
const R = 6378
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

map.on('load', () => {
    map.addSource('places', {
        // This GeoJSON contains features that include an "icon"
        // property. The value of the "icon" property corresponds
        // to an image in the Mapbox Streets style's sprite.
        'type': 'geojson',
        'data': regions
    });

    map.addSource('WAS', {
        type: 'vector',
        // Use any Mapbox-hosted tileset using its tileset id.
        // Learn more about where to find a tileset id:
        // https://docs.mapbox.com/help/glossary/tileset-id/
        url: 'mapbox://wklumpen.dr0b0izs'
    });

    styles = mapStyles["tsi"]
    map.addLayer(
        {
            'id': 'was-tsi',
            'type': 'fill',
            'source': 'WAS',
            'minzoom': 1,
            'source-layer': 'test_upload-4j33zp',
            "paint": {
                "fill-color": [
                    'step',
                    ['get', 'tsi_20200224_WEDAM'],
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
    ); 200

    // Add the places dot layer.
    map.addLayer({
        'id': 'places',
        'type': 'circle',
        'source': 'places',
        'maxzoom': 10,
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
        map.flyTo({center: coords, zoom: 10})
        setRegionalContext(e.features[0].properties.tag)
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'places', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'places', () => {
        map.getCanvas().style.cursor = '';
    });

    // Zoom event to control context-dependent information
    map.on('moveend', () => {
        if ((map.getZoom() < 10) & (currentTextElement.id != "start-text")) {
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
    }
});