const orangePurple = ["#67009e", "#d36d64", "#e89c4f", "#eef91a"]
const purpleRed = ["#ce9ecc", "#da6bb2", "#e23189", "#c61159"]
const viridis = ["#7ad151", "#22a884", "#2a788e", "#414487"].reverse()
const magma = ["#3b0f70", "#8c2981", "#de4968", "#fe9f6d"]
const nullColor = "#aaaaaa"

const cumulativeMeasures = ["C000", "acres", "tsi"]

const regionDetails = {
    "BOS": {
        "name": "Boston"
    },
    "CHI": {
        "name": "Chicago"
    },
    "LA": {
        "name": "Los Angeles"
    },
    "NYC": {
        "name": "New York City"
    },
    "PHL": {
        "name": "Philadelphia"
    },
    "SFO": {
        "name": "San Francisco-Oakland"
    },
    "WAS": {
        "name": "Washington D.C."
    },
}

const opportunityDetails = {
    "tsi": {
        "title": "Transit Service Intensity",
        "name": "transit service intensity",
        "unit": "hourly trips",
        "ylabel": "Nearby Hourly Trips"
    },
    "C000": {
        "title": "Access to Employment",
        "name": "employment",
        "unit": "jobs",
        "ylabel": "Jobs Reachable"
    },
    "acres": {
        "title": "Access to Park Space",
        "name": "park space",
        "unit": "acres",
        "ylabel": "Acres of Park Space Reachable"
    },
    "hospitals": {
        "title": "Access to Hospitals",
        "name": "hospitals",
        "unit": "minutes",
        "ylabel": "Travel Time (min)"
    },
    "urgent_care_facilities": {
        "title": "Access to Urgent Care Facilities",
        "name": "urgent care facilities",
        "unit": "minutes",
        "ylabel": "Travel Time (min)"
    },
    "pharmacies": {
        "title": "Access to Pharmacices",
        "name": "pharmacies",
        "unit": "minutes",
        "ylabel": "Travel Time (min)"
    },
    "education": {
        "title": "Access to Colleges & Universities",
        "name": "colleges and universities",
        "unit": "minutes",
        "ylabel": "Travel Time (min)"
    },
    "grocery": {
        "title": "Access to Supermarkets",
        "name": "supermarkets",
        "unit": "minutes",
        "ylabel": "Travel Time (min)"
    },
    "early_voting": {
        "title": "Access to Early Voting Locations",
        "name": "early voting",
        "unit": "minutes",
        "ylabel": "Travel Time (min)"
    },

}

const mapStyles = {
    "tsi": {
        "breaks": [10, 40, 100],
        "colors": purpleRed
    },
    "C000_c30": {
        "breaks": [1000, 75000, 200000],
        "colors": viridis
    },
    "C000_c45": {
        "breaks": [4000, 28000, 150000],
        "colors": viridis
    },
    "C000_c45f_2023": {
        "breaks": [4000, 28000, 150000],
        "colors": viridis
    },
    "C000_c45f_2020": {
        "breaks": [4000, 28000, 150000],
        "colors": viridis
    },
    "C000_c60": {
        "breaks": [15000, 125000, 680000],
        "colors": viridis
    },
    "C000_c90": {
        "breaks": [136000, 1000000, 1250000],
        "colors": viridis
    },
    "acres_c15": {
        "breaks": [15, 30, 100],
        "colors": viridis
    },
    "acres_c30": {
        "breaks": [50, 100, 150],
        "colors": viridis
    }
}

const measureParameters = {
    "C000": [
        {
            "key": "c30",
            "name": "30 minutes",
            "default": false
        },
        {
            "key": "c45",
            "name": "45 minutes",
            "default": true
        },
        {
            "key": "c60",
            "name": "60 minutes",
            "default": false
        },
        {
            "key": "c90",
            "name": "90 minutes",
            "default": false
        },
    ],
    "acres": [
        {
            "key": "c15",
            "name": "15 minutes",
            "default": false
        },
        {
            "key": "c30",
            "name": "30 minutes",
            "default": true
        },
    ],
    "hospitals": [
        {
            "key": "t1",
            "name": "Nearest",
            "default": true
        },
        {
            "key": "t3",
            "name": "3rd Nearest",
            "default": false
        },
    ],
    "urgent_care_facilities": [
        {
            "key": "t1",
            "name": "Nearest",
            "default": true
        },
        {
            "key": "t3",
            "name": "3rd Nearest",
            "default": false
        },
    ],
    "pharmacies": [
        {
            "key": "t1",
            "name": "Nearest",
            "default": true
        },
        {
            "key": "t3",
            "name": "3rd Nearest",
            "default": false
        },
    ],
    "education": [
        {
            "key": "t1",
            "name": "Nearest",
            "default": true
        },
        {
            "key": "t3",
            "name": "3rd Nearest",
            "default": false
        },
    ],
    "grocery": [
        {
            "key": "t1",
            "name": "Nearest",
            "default": true
        },
        {
            "key": "t3",
            "name": "3rd Nearest",
            "default": false
        },
    ],
    "early_voting": [
        {
            "key": "t1",
            "name": "Nearest",
            "default": true
        }
    ],
    "tsi": [
        {
            "key": "tsi",
            "name": "Hourly Trips",
            "default": true
        }
    ]
}

const tripOptionNames = {
    "c15": "15 minutes",
    "c30": "30 minutes",
    "c45": "45 minutes",
    "c60": "60 minutes",
    "c90": "90 minutes",
    "t1": "Nearest",
    "t3": "3rd Nearest",
    "tsi": "Hourly Trips",
}

const todNames = {
    "WEDAM": "Weekday Morning (7-9am)",
    "WEDPM": "Weekday Evening (9-11pm)",
    "SATAM": "Saturday Morning (10am-12pm)"
}

const popStyle = {
    'B03002_001E': {
        'label': 'Everyone',
        'sentence': 'everyone',
        'color': "#5f5f5f"
    },
    'B03002_006E': {
        'label': "Asian",
        'sentence': 'Asian people, Native Hawaiians, and Pacific Islanders',
        'color': "#4c78a8"
    },
    'B03002_004E': {
        'label': "Black",
        'sentence': 'Black people',
        'color': "#f58518"
    },
    'B03002_012E': {
        'label': "Hisp/Latina",
        'sentence': "Latinx people",
        'color': "#e45756"
    },
    'B03002_003E': {
        'label': "White",
        'sentence': 'white people',
        'color': "#72b7b2"
    },
    'low_income': {
        'label': "In Poverty",
        'sentence': 'people in poverty',
        'color': '#54a24b'
    },
    'B11003_016E': {
        'label': 'Single Mothers',
        'sentence': 'single mothers',
        'color': '#eeca3b'
    },
    'age_65p': {
        'label': 'Age 65+',
        'sentence': 'aged 65 and above',
        'color': '#b279a2'
    },
    'zero_car_hhld': {
        'label': 'Zero-Car Households',
        'sentence': 'zero-car households',
        'color': '#ff9da6'
    }
}

const travelTimeStyle = {
    "breaks": [15, 30, 45],
    "colors": orangePurple
}

const autoRatioStyle = {
    "breaks": [0.1, 0.3, 0.5],
    "colors": magma
}

function styleNumbers(val) {
    if (Math.abs(val) >= 1000000) {
        // val = Math.round(val / 1000000) * 1000000
        val = val / 1000000
        return val.toFixed(2).toString() + "m";
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