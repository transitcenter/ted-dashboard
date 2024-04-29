function opportunityChanged(opportunitySelect) {
    var selectedOpporunity = opportunitySelect.value;
    var tripOptionSelect = document.getElementById("tripOptions");
    var affordableTripsCheck = document.getElementById("affordableTrips");
    var affordableTripsLabel = document.getElementById("affordableTripsLabel");
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
        affordableTripsCheck.disabled = false;
        affordableTripsLabel.classList.remove("text-gray-400");
        affordableTripsLabel.classList.add("text-gray-900");
    }
    else {
        affordableTripsCheck.disabled = true;
        affordableTripsLabel.classList.remove("text-gray-900");
        affordableTripsLabel.classList.add("text-gray-400");
    }
}