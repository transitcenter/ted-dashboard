// const regionKeys = ["WAS", "CHI", "LA", "SFO", "NYC"]
const regionKeys = ["BOS", "CHI", "LA", "NYC", "PHL", "SFO", "WAS"]

const defaultDate = "20240304"
const defaultTOD = "WEDAM"

const fares2023 = ["BOS", "SFO", "WAS"]

const dateList = [
    ['20240304', 'March 4, 2024'],
    ['20230925', 'September 25, 2023'],
    ['20230327', 'March 27, 2023'],
    ['20220808', 'August 8, 2022'],
    ['20220328', 'March 28, 2022'],
    ['20210913', 'September 13, 2021'],
    ['20210712', 'July 12, 2021'],
    ['20210222', 'February 22, 2021'],
    ['20210118', 'January 18, 2021'],
    ['20201221', 'December 21, 2020'],
    ['20201116', 'November 16, 2020'],
    ['20201019', 'October 19, 2020'],
    ['20200921', 'September 21, 2020'],
    ['20200817', 'August 17, 2020'],
    ['20200720', 'July 20, 2020'],
    ['20200622', 'June 22, 2020'],
    ['20200511', 'May 11, 2020'],
    ['20200420', 'April 20, 2020'],
    ['20200316', 'March 16, 2020'],
    ['20200224', 'February 24, 2020'],
]

const affordableTripOptions = [
    ["all", "All Trips"],
    ["2020", "Affordable (2020)"],
    ["2023", "Affordable (2023 if available)"]
]

const opportunityNames = {
    "C000": {
        "legendTitle": "Access to Employment (jobs)"
    },
    "acres": {
        "legendTitle": "Access to Park Space (acres)"
    },
    "hospitals": {
        "legendTitle": "Access to Hospitals (minutes)"
    },
    "urgent_care_facilities": {
        "legendTitle": "Access to Urgent Care (minutes)"
    },
    "pharmacies": {
        "legendTitle": "Access to Pharmacies (minutes)"
    },
    "education": {
        "legendTitle": "Access to Education (minutes)"
    },
    "grocery": {
        "legendTitle": "Access to Grocery Stores (minutes)"
    },
    "early_voting": {
        "legendTitle": "Access to Early Voting (minutes)"
    },
    "tsi": {
        "legendTitle": "Nearby Hourly Trips"
    }
}

let controlState = {
    "date": "20230926",
    "tod": "WEDAM",
    "opportunity": "C000",
    "option": "c45",
    "affordable": "all",
    "auto": false,
    "initalContextSet": false,
    "showTransitLines": false
}

var legendMargin = {top: 5, right: 10, bottom: 10, left: 10}

function autoCompareChanged(autoCompareCheckbox) {
    console.log("New value:", autoCompareCheckbox.checked)
    controlState["auto"] = autoCompareCheckbox.checked
    restyleLayers()
}

function affordableTripsChanged(affordableTripsSelect) {
    controlState["affordable"] = affordableTripsSelect.value
    restyleLayers()
}

function clearLegend() {
    legendSvg.selectAll("*").remove()
}

function dateChanged(selectedDate) {
    changeDataSource(selectedDate.value, controlState["tod"])
}

function opportunityChanged(selectedOpportunity) {
    console.log("Opportunity Seleciton Changed: ", selectedOpportunity.value)
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
    console.log("Time Period Selection Changed: ", selectedPeriod.value)
    changeDataSource(controlState["date"], selectedPeriod.value)
}

function restyleLegend(styles) {
    clearLegend();
    console.log(styles)
    var legendBuffer = 10
    var boxWidth = (legendBoxWidth - (2 * legendBuffer) - (5 * (styles.colors.length - 1))) / styles.colors.length

    // Update title
    var legendTitle = document.getElementById("legendTitle")
    legendTitle.innerHTML = opportunityNames[controlState["opportunity"]]["legendTitle"]

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
        .style('fill', 'black')
        .text(d => styleNumbers(d))
        .style("text-anchor", "middle")
        .style('alignment-baseline', 'top')
}

function showTransitLinesChanged(checkedOption) {
    console.log("Show transit lines changed: ", checkedOption.checked)
    controlState["showTransitLines"] = checkedOption.checked
    if (checkedOption.checked == true) {
        // Hide all
        regionKeys.forEach(function (region, idx) {
            map.setLayoutProperty(region + "-transit"),
                "visibility",
                "visible"
        })
    }
    else {
        regionKeys.forEach(function (region, idx) {
            map.setLayoutProperty(region + "-transit"),
                "visibility",
                "none"
        })
    }

}

function tripOptionChanged(selectedOption) {
    console.log("Parameter Option Changed: ", selectedOption.value)
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
        console.log(region)
        if (controlState["initalContextSet"] == true) {
            map.removeLayer(region + "Layer")
            map.removeSource(region + "Source")
        }
        console.log('mapbox://wklumpen.' + region + "-" + sourceDate + "-" + sourceTOD + "-tiles")
        map.addSource(region + 'Source', {
            type: 'vector',
            url: 'mapbox://wklumpen.' + region + "-" + sourceDate + "-" + sourceTOD + "-tiles"
        });
        styles = mapStyles['tsi']
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

function restyleLayers() {
    console.log(controlState)
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
                styles = autoRatioStyle;
                getExpression = ["/", ["get", columnName], ["get", columnName + "_auto"]]
            }
            else {
                styles = mapStyles[controlState["opportunity"] + "_" + controlState["option"]]
                getExpression = ["get", columnName]
            }
        }
        else {
            if (controlState["auto"] == true) {
                styles = autoRatioStyle
                getExpression = ["/", ["get", columnName + "_auto"], ["get", columnName]]
            }
            else {
                styles = travelTimeStyle
                getExpression = ["get", columnName]
            }

        }

        var fillColorExpression = [
            "case", ["==", ["get", columnName], null], nullColor,
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