const orangePurple = ["#67009e", "#d36d64", "#e89c4f", "#eef91a"]
const purpleRed = ["#ce9ecc", "#da6bb2", "#e23189", "#c61159"]
const viridis = ["#7ad151", "#22a884", "#2a788e", "#414487"]
const magma = ["#3b0f70", "#8c2981", "#de4968", "#fe9f6d"]
const nullColor = "#aaaaaa"

const mapStyles = {
    "tsi": {
        "breaks": [10, 40, 100],
        "colors": purpleRed
    },
    "C000_c30": {
        "breaks": [1000, 4000, 215000],
        "colors": orangePurple
    },
    "C000_c45": {
        "breaks": [4000, 28000, 150000],
        "colors": orangePurple
    },
    "C000_c60": {
        "breaks": [15000, 125000, 680000],
        "colors": orangePurple
    },
    "C000_c90": {
        "breaks": [136000, 1000000, 1350000],
        "colors": orangePurple
    },
    "acres_c15": {
        "breaks": [15, 40, 100],
        "colors": orangePurple
    },
    "acres_c30": {
        "breaks": [30, 75, 100],
        "colors": orangePurple
    }
}

const travelTimeStyle = {
    "breaks": [15, 30, 45],
    "colors": viridis
}

const autoRatioStyle = {
    "breaks": [0.1, 0.3, 0.5],
    "colors": magma
}

function styleNumbers(val) {
    if (Math.abs(val) >= 1000000) {
        val = Math.round(val / 1000000) * 1000000
        val = val / 1000000
        return val.toFixed(0).toString() + "m";
    }
    else if (Math.abs(val) >= 1000) {
        val = Math.round(val / 1000) * 1000
        val = val / 1000
        return val.toFixed(0).toString() + "k";
    }
    else if (Math.abs(val) > 10) {
        return val.toFixed(0)
    }
    else if (val == 0.0) {
        return val.toFixed(0)
    }
    else {
        return val.toFixed(2)
    }
}