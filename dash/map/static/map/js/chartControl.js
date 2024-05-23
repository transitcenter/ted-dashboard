const fareYears = {
    "BOS": "f_2023",
    "CHI": "f_2020",
    "LA": "f_2020",
    "NYC": "f_2020",
    "PHL": "f_2020",
    "SFO": "f_2023",
    "WAS": "f_2023"
}

const regions = ["BOS", "CHI", "LA", "PHL", "NYC", "SFO", "WAS"]
const periods = ["WEDAM", "WEDPM", "SATAM"]

function opportunityChanged(opportunitySelect) {
    var selectedOpporunity = opportunitySelect.value;
    var tripOptionSelect = document.getElementById("tripOptions");
    var affordableTripsCheck = document.getElementById("affordableTrips");
    var affordableTripsLabel = document.getElementById("affordableTripsLabel");
    var autoRatioCheck = document.getElementById("autoRatio");
    var autoRatioLabel = document.getElementById("autoRatioLabel");
    // Clear the options
    while (tripOptionSelect.options.length > 0) {
        tripOptionSelect.remove(0)
    }
    // Repopulate using the right opportunity
    measureParameters[selectedOpporunity].forEach(function (option, index) {
        var opt = document.createElement("option")
        opt.value = option["key"]
        opt.text = option["name"]
        opt.selected = option["default"]
        tripOptionSelect.add(opt)
    })

    if (cumulativeMeasures.includes(selectedOpporunity)) {
        console.log("Cumulative measure")
        autoRatioCheck.removeAttribute('disabled')
        autoRatioLabel.classList.remove("text-gray-400");
        autoRatioLabel.classList.add("text-gray-900");

        affordableTripsCheck.removeAttribute('disabled')
        affordableTripsLabel.classList.remove("text-gray-400");
        affordableTripsLabel.classList.add("text-gray-900");
    }
    else {
        affordableTripsCheck.disabled = true;
        affordableTripsCheck.checked = false;
        affordableTripsLabel.classList.remove("text-gray-900");
        affordableTripsLabel.classList.add("text-gray-400");

        autoRatioCheck.removeAttribute('disabled')
        autoRatioLabel.classList.remove("text-gray-400");
        autoRatioLabel.classList.add("text-gray-900");
    }

    if (selectedOpporunity == "tsi") {
        affordableTripsCheck.disabled = true;
        affordableTripsCheck.checked = false;
        affordableTripsLabel.classList.remove("text-gray-900");
        affordableTripsLabel.classList.add("text-gray-400");

        autoRatioCheck.disabled = true;
        autoRatioCheck.checked = false;
        autoRatioLabel.classList.remove("text-gray-900");
        autoRatioLabel.classList.add("text-gray-400");
    }
}

function affordableTripsChanged() {
    affordableTripsCheck = document.getElementById("affordableTrips")
    compareToAutoCheck = document.getElementById("autoRatio")
    if (affordableTripsCheck.checked == true) {
        compareToAutoCheck.checked = false;
    }
}

function autoRatioChanged() {
    affordableTripsCheck = document.getElementById("affordableTrips")
    compareToAutoCheck = document.getElementById("autoRatio")
    if (compareToAutoCheck.checked == true) {
        affordableTripsCheck.checked = false;
    }
}