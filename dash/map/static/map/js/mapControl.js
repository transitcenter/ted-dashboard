// const regionKeys = ["WAS", "CHI", "LA", "SFO", "NYC"]
const regionKeys = ["BOS", "CHI", "LA", "NYC", "PHL", "SFO", "WAS"]

const fares2023 = ["BOS", "SFO", "WAS"]

const affordableTripOptions = [
    ["all", "All Trips"],
    ["2020", "Affordable (2020)"],
    ["2023", "Affordable (2023 if available)"]
]

const opportunityNames = {
    "C000": {
        "legendTitle": "Access to Employment",
        "legendSubTitle": "Higher values are better",
        "legendUnit": "jobs"
    },
    "acres": {
        "legendTitle": "Access to Park Space",
        "legendSubTitle": "Higher values are better",
        "legendUnit": "acres"
    },
    "hospitals": {
        "legendTitle": "Access to Hospitals",
        "legendSubTitle": "Lower values are better",
        "legendUnit": "minutes"
    },
    "urgent_care_facilities": {
        "legendTitle": "Access to Urgent Care",
        "legendSubTitle": "Lower values are better",
        "legendUnit": "minutes"
    },
    "pharmacies": {
        "legendTitle": "Access to Pharmacies",
        "legendSubTitle": "Lower values are better",
        "legendUnit": "minutes"
    },
    "education": {
        "legendTitle": "Access to Education",
        "legendSubTitle": "Lower values are better",
        "legendUnit": "minutes"
    },
    "grocery": {
        "legendTitle": "Access to Grocery Stores",
        "legendSubTitle": "Lower values are better",
        "legendUnit": "minutes"
    },
    "early_voting": {
        "legendTitle": "Access to Early Voting",
        "legendSubTitle": "Lower values are better",
        "legendUnit": "minutes"
    },
    "tsi": {
        "legendTitle": "Nearby Hourly Trips",
        "legendSubTitle": "Higher values are better",
        "legendUnit": "trips/hour"
    }
}

let controlState = {
    "date": "20240304",
    "tod": "WEDAM",
    "opportunity": "C000",
    "option": "c45",
    "affordable": "all",
    "auto": false,
    "initalContextSet": false,
    "dots": "none",
    "showTransitLines": false
}

var legendMargin = {top: 5, right: 10, bottom: 10, left: 10}

function autoCompareChanged(autoCompareCheckbox) {
    controlState["auto"] = autoCompareCheckbox.checked
    restyleLayers()
}

function affordableTripsChanged(affordableTripsSelect) {
    controlState["affordable"] = affordableTripsSelect.value

    var autoCompareCheckbox = document.getElementById("auto")
    if (controlState["affordable"] == "all") {
        autoCompareCheckbox.disabled = false;
    }
    else {
        autoCompareCheckbox.checked = false;
        autoCompareCheckbox.disabled = true;
    }


    controlState["auto"] = false;
    restyleLayers()
}

function clearLegend() {
    legendSvg.selectAll("*").remove()
}

function dateChanged(selectedDate) {
    changeDataSource(selectedDate.value, controlState["tod"])
}

function dotsChanged(selectedDots) {
    changeDotSource(selectedDots.value)
}

function opportunityChanged(selectedOpportunity) {
    controlState["opportunity"] = selectedOpportunity.value
    // Repopulate the options
    tripOptionSelect = document.getElementById("tripOptions")
    // Remove what's there
    while (tripOptionSelect.options.length > 0) {
        tripOptionSelect.remove(0)
    }
    // Repopulate using the right opportunity
    measureParameters[selectedOpportunity.value].forEach(function (option, index) {
        var opt = document.createElement("option");
        opt.value = option["key"];
        opt.text = option["name"];
        opt.selected = option["default"];
        if (option["default"] == true) {
            controlState["option"] = option["key"];
        }
        tripOptionSelect.add(opt);
    })

    // Change Fare Options
    var affordableTripsSelect = document.getElementById("affordableTrips");
    while (affordableTripsSelect.options.length > 0) {
        affordableTripsSelect.remove(0)
    }

    if (cumulativeMeasures.includes(controlState["opportunity"])) {
        // Enable the control 
        affordableTripsSelect.disabled = false;
        affordableTripOptions.forEach(function (option, index) {
            var opt = document.createElement("option")
            opt.value = option[0];
            opt.text = option[1];
            affordableTripsSelect.add(opt);
        })
        affordableTripsSelect.selectedOption = "all";

    }
    else {

        affordableTripsSelect.add(new Option("Option Not Available"));
        affordableTripsSelect.disabled = true;
    }
    restyleLayers()
}

function periodChanged(selectedPeriod) {
    changeDataSource(controlState["date"], selectedPeriod.value)
}

function restyleLegend(styles) {
    clearLegend();
    var legendBuffer = 10
    var boxWidth = (legendBoxWidth - (2 * legendBuffer) - (5 * (styles.colors.length - 1))) / styles.colors.length

    // Update title
    var legendTitle = document.getElementById("legendTitle")
    var legendSubtitle = document.getElementById("legendSubTitle")
    legendTitle.innerHTML = opportunityNames[controlState["opportunity"]]["legendTitle"]

    if (controlState["auto"] == true) {
        if (cumulativeMeasures.includes(controlState["opportunity"])) {
            legendSubtitle.innerHTML = "Total " + opportunityNames[controlState["opportunity"]]["legendUnit"] + " reachable as a % of auto. Higher values are better."
        }
        else {
            legendSubtitle.innerHTML = "Travel time as a multiple of auto. Lower values are better."
        }
    }
    else {
        if (cumulativeMeasures.includes(controlState["opportunity"])) {
            legendSubtitle.innerHTML = "Total " + opportunityNames[controlState["opportunity"]]["legendUnit"] + " reachable. Higher values are better."
        }
        else {
            legendSubtitle.innerHTML = "Travel time in minutes. Lower values are better."
        }
    }

    legendSvg.selectAll("legendBoxes")
        .data(styles.colors)
        .enter()
        .append("rect")
        .attr("y", legendMargin.top)
        .attr("x", (d, i) => (i * (boxWidth + 5)))
        .attr("width", boxWidth)
        .attr("height", 15)
        .style("fill", d => d)
        .style("opacity", 0.7)
        .style("stroke", "#aaaaaa")
        .style("strokeWidth", 1)

    legendSvg.selectAll("legendLabels")
        .data(styles.breaks)
        .enter()
        .append("text")
        .attr("x", (d, i) => (i * (boxWidth + 5)) + boxWidth)
        .attr("y", legendMargin.top + 35)
        .style('fill', "black")
        .text(function (d) {
            if ((controlState["auto"] == true) & cumulativeMeasures.includes(controlState["opportunity"])) {
                return styleNumbers(100 * d) + "%";
            }
            else {
                return styleNumbers(d);
            }

        }
        )
        .style("text-anchor", "middle")
        .style('alignment-baseline', 'top')
}

function showTransitLinesChanged(checkedOption) {
    controlState["showTransitLines"] = checkedOption.checked
    if (checkedOption.checked == true) {
        // Show all
        regionKeys.forEach(function (region, idx) {
            map.setLayoutProperty(region + "Transit", "visibility", "visible");
            // Move them to top
            map.moveLayer(region + "Layer", region + "Transit")
        })
    }
    else {
        regionKeys.forEach(function (region, idx) {
            map.setLayoutProperty(region + "Transit", "visibility", "none");
        })
    }

}

function tripOptionChanged(selectedOption) {
    controlState["option"] = selectedOption.value
    restyleLayers()
}

/**
 * Change the data source that we are attached to on a date or time period
 * change.
 * @param {string} sourceDate The 8-character date string (YYYYMMDD)
 * @param {string} sourceTOD The time of day key (WEDAM, WEDPM, SATAM)
 */
function changeDataSource(sourceDate, sourceTOD) {
    // Drop the existing data sources for each one
    regionKeys.forEach(function (region, idx) {

        if (controlState["initalContextSet"] == true) {
            map.removeLayer(region + "Layer")
            map.removeSource(region + "Source")
        }
        map.addSource(region + 'Source', {
            type: 'vector',
            url: 'mapbox://wklumpen.' + region + "-" + sourceDate + "-" + sourceTOD + "-tiles"
        });

        map.addLayer(
            {
                'id': region + 'Layer',
                'type': 'fill',
                'source': region + 'Source',
                'minzoom': 10,
                // 'maxzoom': 10,
                'source-layer': region + "-" + sourceDate + "-" + sourceTOD,
                "paint": {
                    "fill-color": nullColor,
                    "fill-opacity": 0.8,
                }
            },
            'road-label-simple' // Add layer below labels
        );
    })
    controlState["initalContextSet"] = true
    controlState["date"] = sourceDate
    controlState["tod"] = sourceTOD
    restyleLayers()
}

function changeDotSource(dotKey) {
    // TODO: Adjust to allow more regions once data uploaded.
    ["BOS"].forEach(function (region, idx) {
        if (controlState["dots"] != "none") {
            map.removeLayer(region + "Dots")
            map.removeSource(region + "DotSource")
        }
        if (dotKey != "none") {
            map.addSource(region + 'DotSource', {
                type: 'vector',
                url: 'mapbox://wklumpen.' + region + "-" + dotKey + "-dots-tiles"
            });
            map.addLayer(
                {
                    'id': region + 'Dots',
                    'type': 'circle',
                    'source': region + 'DotSource',
                    'minzoom': 10,
                    // 'maxzoom': 10,
                    'source-layer': region + "-" + dotKey + "-dots",
                    "paint": {
                        "circle-color": dotsColor,
                        "circle-radius": 2,
                        "circle-opacity": 0.7,
                    }
                },
                'road-label-simple' // Add layer below labels
            );
        }
    })
    controlState["dots"] = dotKey
}

function restyleLayers() {
    regionKeys.forEach(function (region, idx) {
        // Let's start with a simple style guide
        var columnName = null;
        if (controlState["opportunity"] == "tsi") {
            columnName = "tsi"
        }
        else if (controlState["affordable"] != "all") {
            if ((controlState["affordable"] == "2023") & fares2023.includes(region)) {
                columnName = controlState["opportunity"] + "_" + controlState["option"] + "f_" + controlState["affordable"]
            }
            else {
                columnName = controlState["opportunity"] + "_" + controlState["option"] + "f_" + "2020";
            }

        }
        else {
            columnName = controlState["opportunity"] + "_" + controlState["option"]
        }
        var styles = null;
        var getExpression = null;
        if (cumulativeMeasures.includes(controlState["opportunity"])) {
            if (controlState["opportunity"] == "tsi") {
                styles = mapStyles["tsi"];
                getExpression = ["/", ["get", columnName], 2]
            }
            else if (controlState["auto"] == true) {
                styles = autoRatioCumulativeStyle;
                getExpression = ["case",
                    ["<=", ["get", columnName + "_auto"], 0], -1,
                    ["/", ["get", columnName], ["get", columnName + "_auto"]]
                ]
            }
            else {
                styles = mapStyles[controlState["opportunity"] + "_" + controlState["option"]]
                getExpression = ["get", columnName]
            }
        }
        else {
            if (controlState["auto"] == true) {
                styles = autoRatioTravelTimeStyle
                getExpression = ["case",
                    ["<=", ["get", columnName + "_auto"], 0], -1,
                    ["/", ["get", columnName], ["get", columnName + "_auto"]]
                ]
            }
            else {
                styles = travelTimeStyle
                getExpression = ["get", columnName]
            }

        }

        var fillColorExpression = [
            "case",
            ["==", getExpression, -1], unreachableColor,
            [
                'step',
                getExpression,
                styles["colors"][0],
                styles["breaks"][0],
                styles["colors"][1],
                styles["breaks"][1],
                styles["colors"][2],
                styles["breaks"][2],
                styles["colors"][3],
            ]]

        layerName = region + "Layer"
        map.setPaintProperty(layerName, "fill-color", fillColorExpression);

        restyleLegend(styles);
    });
}