// Populate date selector
var dateSelect = document.getElementById("date")
const defaultDate = "20240305"
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

regionChanged(document.getElementById("region"))
dateChanged(document.getElementById("date"))

function regionChanged(regionSelect) {
    console.log(regionSelect.value)
    var region = regionSelect.value
    var date = document.getElementById("date").value

    // Update the region we're talking about
    document.getElementById("regionTitle").innerHTML = "Data Downloads for " + regionDetails[region]["name"]

    // Update the summary data links
    var WEDAM_summary = "/static/map/data/summary/summary_" + region + "_WEDAM.csv";
    var WEDPM_summary = "/static/map/data/summary/summary_" + region + "_WEDPM.csv";
    var SATAM_summary = "/static/map/data/summary/summary_" + region + "_SATAM.csv";

    document.getElementById("summaryLinkWEDAM").href = WEDAM_summary;
    document.getElementById("summaryLinkWEDPM").href = WEDPM_summary;
    document.getElementById("summaryLinkSATAM").href = SATAM_summary;

    document.getElementById("transitLink").href = "/static/map/data/transit/" + region + "_transit.geojson";

    updateScoreLinks(region, date)
    updateDotsLinks(region)
}

function dateChanged(dateSelect) {
    document.getElementById("weekLabel").innerHTML = "for the week of " + dateSelect.options[dateSelect.selectedIndex].text;
    var region = document.getElementById("region").value
    updateScoreLinks(region, dateSelect.value)
}

function updateScoreLinks(region, date) {
    // Update the score data links
    var WEDAM_score = "/static/map/data/score/acs_" + region + "_" + date + "_WEDAM.csv";
    var WEDPM_score = "/static/map/data/score/acs_" + region + "_" + date + "_WEDPM.csv";
    var SATAM_score = "/static/map/data/score/acs_" + region + "_" + date + "_SATAM.csv";

    document.getElementById("scoreLinkWEDAM").href = WEDAM_score;
    document.getElementById("scoreLinkWEDPM").href = WEDPM_score;
    document.getElementById("scoreLinkSATAM").href = SATAM_score;
}

function updateDotsLinks(region) {
    Object.keys(popStyle).forEach(element => {
        document.getElementById("dotsLink" + element).href = "/static/map/data/dots/" + region + "_" + element + ".geojson";
    });
}
