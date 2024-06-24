let chartMargin = {top: 90, right: 10, bottom: 50, left: 70}
let barChartMargin = {top: 90, right: 20, bottom: -40, left: 20}

let chartWidth = d3.select("#chartContainer").node().getBoundingClientRect().width
let chartHeight = d3.select("#chartContainer").node().getBoundingClientRect().height
let chartBoxHeight = chartHeight - chartMargin.top - chartMargin.bottom
let chartBoxWidth = chartWidth - chartMargin.left - chartMargin.right

let barChartWidth = d3.select("#barChartContainer").node().getBoundingClientRect().width
let barChartHeight = d3.select("#barChartContainer").node().getBoundingClientRect().height
let barChartBoxHeight = barChartHeight - barChartMargin.top - barChartMargin.bottom
let barChartBoxWidth = barChartWidth - barChartMargin.left - barChartMargin.right

let chartSVG = d3.select("#chartContainer").append('svg').attr('width', chartWidth).attr('height', chartHeight)
let barChartSVG = d3.select("#barChartContainer").append('svg').attr('width', barChartWidth).attr('height', barChartHeight)

var searchParams = new URLSearchParams(window.location.search)

if (searchParams.has("region") & regions.includes(searchParams.get("region"))) {
    document.getElementById("region").value = searchParams.get("region");
}

if (searchParams.has("area")) {
    document.getElementById("area").value = searchParams.get("area");
}

if (searchParams.has("period") & periods.includes(searchParams.get("period"))) {
    document.getElementById("period").value = searchParams.get("period");
}

if (searchParams.has("opportunity") & Object.keys(opportunityDetails).includes(searchParams.get("opportunity"))) {
    var opp = searchParams.get("opportunity")
    document.getElementById("opportunity").value = opp;

    var affordableTripsCheck = document.getElementById("affordableTrips");
    var affordableTripsLabel = document.getElementById("affordableTripsLabel");
    var autoRatioCheck = document.getElementById("autoRatio");
    var autoRatioLabel = document.getElementById("autoRatioLabel");

    if (cumulativeMeasures.includes(opp)) {
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

    if (opp == "tsi") {
        affordableTripsCheck.disabled = true;
        affordableTripsCheck.checked = false;
        affordableTripsLabel.classList.remove("text-gray-900");
        affordableTripsLabel.classList.add("text-gray-400");

        autoRatioCheck.disabled = true;
        autoRatioCheck.checked = false;
        autoRatioLabel.classList.remove("text-gray-900");
        autoRatioLabel.classList.add("text-gray-400");
        document.getElementById("tripOptions").value = "tsi";
    }

}
if (searchParams.has("tripOption")) {
    document.getElementById("tripOptions").value = searchParams.get("tripOption");
}

if (searchParams.has("affordableTrips") & (searchParams.get("affordableTrips") == "true")) {
    document.getElementById("affordableTrips").checked = true;
}
if (searchParams.has("autoRatio") & (searchParams.get("autoRatio") == "true")) {
    document.getElementById("autoRatio").checked = true;
}

opportunityChanged(document.getElementById("opportunity"))
updateChart()

function updateChart() {

    var region = document.getElementById("region").value;
    var area = document.getElementById("area").value;
    var period = document.getElementById("period").value;
    var opportunity = document.getElementById("opportunity").value;
    var tripOption = document.getElementById("tripOptions").value;
    var autoRatioCheck = document.getElementById("autoRatio").checked;
    var affordableTripsCheck = document.getElementById("affordableTrips").checked;

    if ('URLSearchParams' in window) {
        var searchParams = new URLSearchParams(window.location.search)
        searchParams.set("region", region);
        searchParams.set("area", area);
        searchParams.set("period", period);
        searchParams.set("opportunity", opportunity);
        searchParams.set("tripOption", tripOption);
        searchParams.set("autoRatio", autoRatioCheck);
        searchParams.set("affordableTrips", affordableTripsCheck);
        var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
        history.pushState(null, '', newRelativePathQuery);
    }
    // Let's load the proper CSV based on settings
    d3.csv("/static/map/data/summary/summary_" + region + "_" + period + ".csv")
        .then(function (data) {
            //TODO: dynamic keys
            var scoreKey = null;

            if (opportunity == "tsi") {
                scoreKey = "tsi"
            }
            else {
                scoreKey = opportunity + "_" + tripOption
            }
            if (affordableTripsCheck == true) {
                scoreKey = scoreKey + fareYears[region]
            }

            var demoList = [];
            for (var demo in popStyle) {
                var demoCheck = document.getElementById(demo + "-checkbox")
                if (demoCheck.checked == true) {
                    demoList.push(demo)
                }
            }
            // TODO: Filter the dates and demographics
            var scores = []
            data.forEach(function (item, index) {
                // TODO: Update to clean this up
                if (demoList.includes(item.demographic) & item.area == area) {
                    var obj = {};
                    obj["demographic"] = item.demographic;
                    if (autoRatioCheck == true) {
                        if (cumulativeMeasures.includes(opportunity)) {
                            obj["value"] = 100 * (+item[scoreKey]) / ((+item[scoreKey + "_auto"]));
                        }
                        else {
                            obj["value"] = (+item[scoreKey]) / ((+item[scoreKey + "_auto"]));
                        }
                    }
                    else {
                        obj["value"] = (+item[scoreKey])
                    }
                    obj["date"] = new Date(item.date);
                    scores.push(obj);
                }
            })
            multilinePlot(scores, region, area, period, opportunity, tripOption, autoRatioCheck, affordableTripsCheck);
        })
}

function multilinePlot(scores, region, area, period, opportunity, tripOption, autoRatio, affordable) {

    chartSVG.selectAll('*').remove();

    scores.sort((a, b) => d3.ascending(a.date, b.date));
    var maxDate = d3.max(scores, d => d['date']);

    let barDate = maxDate;
    var barScores = scores.filter(d => d['date'] == barDate);
    barScores = barScores.sort((a, b) => d3.ascending(a.value, b.value))

    var x = d3.scaleTime()
        .domain([Date.parse("2020-02-01"), maxDate])
        .rangeRound([chartMargin.left, chartBoxWidth])

    var y = d3.scaleLinear()
        .domain([0, d3.max(scores, d => d.value)])
        .range([chartBoxHeight + chartMargin.top, chartMargin.top])


    var line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value))
        .curve(d3.curveLinear)

    // Now we simply add in some dates
    var dateList = [];
    var dateStringList = [];
    var groups = [];

    scores.forEach(function (key, index) {
        if (!dateStringList.includes(key.date.toDateString())) {
            dateList.push(key.date)
            dateStringList.push(key.date.toDateString())
        }
        if (!groups.includes(key.demographic)) {
            groups.push(key.demographic)
        }
    })

    function onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
    }
    dateList = dateList.filter(onlyUnique);

    var sticks = chartSVG.selectAll("stick")
        .data(dateList)
        .enter()
        .append("line")
        .attr("class", 'theStick')
        .attr("x1", d => x(d))
        .attr("x2", d => x(d))
        .attr("y1", chartMargin.top)
        .attr("y2", chartBoxHeight + chartMargin.top)
        .attr("stroke", function (d) {
            if (d == barDate) {
                return '#BEBEBE'
            }
            else {
                return "#F1F1F1"
            }
        })
        .attr('opacity', 0.7)
        .style('cursor', 'pointer')
        .style('stroke-width', '10px')

    var stickText = chartSVG.append("text")
        .attr("y", chartMargin.top)
        .attr("x", x(barDate))
        .attr("dy", "-0.5em")
        .attr('class', 'text-sm')
        .style("text-anchor", "middle")
        .style("vertical-align", "top")
        .text(barDate.toDateString());

    groups.forEach(function (key, index) {
        var toPlot = scores.filter(d => (d['demographic'] == key));
        var item = popStyle[key]
        var path = chartSVG.append('path')
            .datum(toPlot)
            .attr('class', 'line')
            .attr("d", line)
            .style('fill', 'none')
            .style('stroke', item.color)
            .style('stroke-width', function () {
                if (key == 'B03002_001E') {
                    return 3;
                }
                else {
                    return 2;
                }
            })
            .style('opacity', function () {
                if (key == 'B03002_001E') {
                    return 1.0;
                }
                else {
                    return 0.9;
                }
            })

        path.on('mouseover', function (e, d) {
            //TODO: DO STUFF
        })
    })

    var ylabel = opportunityDetails[opportunity]["ylabel"]
    if (affordable == true) {
        ylabel += " [affordable trips]"
    }
    var seriesTitleText = ""

    if (autoRatio == true) {
        if (cumulativeMeasures.includes(opportunity)) {
            console.log(scores)
            ylabel = ylabel + " [transit as a % of auto]"
        }
        else {
            ylabel = ylabel + " [transit as a multiple of auto]"
        }

        seriesTitleText = "Transit vs Auto average " + opportunityDetails[opportunity]["title"] + " in " + regionDetails[region]["name"]
    }
    else {
        seriesTitleText = "Average " + opportunityDetails[opportunity]["title"] + " in " + regionDetails[region]["name"]
    }

    var dataNote = null;
    if (cumulativeMeasures.includes(opportunity) | (opportunity == "tsi")) {

        if (autoRatio == true) {
            dataNote = "Higher values are better. Interpret as transit reaching X% of jobs compared to a car."
        }
        else {
            dataNote = "Higher values are better."
        }
    }
    else {
        if (autoRatio == true) {
            dataNote = "Lower values are better. Interpret as transit taking X times as long as a car."
        }
        else {
            dataNote = "Lower values are better."
        }

    }
    // Time series y-axis label
    // chartSVG.append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 10)
    //     .attr("x", 0 - chartMargin.top - (chartBoxHeight / 2))
    //     .attr("dy", "1em")
    //     .style("text-anchor", "middle")
    //     .text(ylabel);

    // Time series y-axis label (title)
    chartSVG.append("text")
        .attr("y", 10)
        .attr("x", chartWidth / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("class", "text-lg font-bold")
        .text(seriesTitleText);

    var seriesSubtitleFirstRow = ylabel + " | " + tripOptionNames[tripOption] + " | " + todNames[period] + " | " + areaNames[area]
    // Subtitle first row
    chartSVG.append('text')
        .attr('class', 'barDateSubtitle')
        .attr('x', barChartWidth / 2)
        .attr('y', 50)
        .text(seriesSubtitleFirstRow)
        .attr('text-anchor', 'middle')
        .attr("class", 'text-sm')

    // Subtitle second row
    chartSVG.append('text')
        .attr('class', 'barDateSubtitle')
        .attr('x', barChartWidth / 2)
        .attr('y', 70)
        .text(dataNote)
        .attr('text-anchor', 'middle')
        .attr("class", 'text-xs')

    // Time series y-axis
    if ((autoRatio == true) & cumulativeMeasures.includes(opportunity)) {
        chartSVG.append("g")
            .attr("transform", "translate(" + chartMargin.left + ", 0)")
            .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + "%"));
    }
    else {
        chartSVG.append("g")
            .attr("transform", "translate(" + chartMargin.left + ", 0)")
            .call(d3.axisLeft(y).ticks(5));
    }


    // Time series x-axis
    if (chartBoxWidth < 900) {
        chartSVG.append("g")
            .attr("transform", "translate(0," + (chartBoxHeight + chartMargin.top) + ")")
            .call(d3.axisBottom(x).ticks(4).tickFormat(d3.timeFormat("%b %Y")));
    }
    else {
        chartSVG.append("g")
            .attr("transform", "translate(0," + (chartBoxHeight + chartMargin.top) + ")")
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y")));
    }

    sticks.on('click', function (e, d) {
        updateBars(d);
    })

    sticks.on('mouseover', function (e, d) {
        d3.select(this)
            .transition()
            .attr('stroke', '#2D74ED')
            .attr('opacity', 0.5)
        // Highlight the connections
        stickText.transition().attr("x", x(d)).text(d.toDateString());
    })
        .on('mouseout', function (e, d) {
            if (d == barDate) {
                d3.select(this).transition().attr('stroke', '#BEBEBE')
            }
            else {
                d3.select(this).transition().attr('stroke', '#F1F1F1')
            }

        })

    chartSVG.on('mouseleave', function (e, d) {
        stickText.transition().attr("x", x(barDate)).text(barDate.toDateString())
    })

    updateBars(barDate);

    function updateBars(upDate) {
        barDate = upDate;
        barScores = scores.filter(d => d['date'].toDateString() == barDate.toDateString());
        barScores = barScores.sort((a, b) => d3.descending(a.value, b.value));

        barChartSVG.selectAll('*').remove();

        var barX = d3.scaleBand()
            .domain(barScores.map(d => popStyle[d.demographic].label))
            .range([barChartMargin.left, barChartBoxWidth])
            .padding(0.2);

        var barY = d3.scaleLinear()
            .domain([0, d3.max(barScores, d => d.value)])
            .range([barChartBoxHeight, barChartMargin.top])

        barChartSVG.append("g")
            .attr("transform", "translate(0," + barChartBoxHeight + ")")
            .call(d3.axisBottom(barX))
            .selectAll('text')
            // .attr("transform", "translate(-10,0)")
            .style("text-anchor", "middle");

        barChartSVG.selectAll("bars")
            .data(barScores)
            .enter()
            .append("rect")
            .attr("x", d => barX(popStyle[d.demographic].label))
            .attr("y", d => barY(d.value))
            .attr("width", barX.bandwidth())
            .attr("height", d => barChartBoxHeight - barY(d.value))
            .attr("fill", d => popStyle[d.demographic].color)
            .attr('stroke', function (d) {
                if (d.demographic == 'B03002_001E') {
                    return '5px solid black';
                }
                else {
                    return 'none';
                }
            })
            .attr('opacity', function (d) {
                if (d.demographic == 'B03002_001E') {
                    return 1.0;
                }
                else {
                    return 0.9;
                }
            })
            .on('mouseover', function (e, d) {
                chartSVG.selectAll(".line")
                    .transition()
                    .attr("stroke-width", function (g, idx) {
                        if (g[idx].demographic == d.demographic) {
                            return 8;
                        }
                        else {
                            return 6;
                        }
                    })
            })

        barChartSVG.selectAll("barLabels")
            .data(barScores)
            .enter()
            .append("text")
            .attr('class', 'text-sm')
            .attr("x", d => barX(popStyle[d.demographic].label) + (barX.bandwidth() / 2))
            .attr("y", d => barY(d.value))
            .attr("dy", "-0.5em")
            .text(function (d) {
                if ((autoRatio == true) & (cumulativeMeasures.includes(opportunity))) {
                    return styleNumbers(d.value) + "%";
                }
                else {
                    return styleNumbers(d.value);
                }
            })
            .attr('text-anchor', 'middle')

        var barTitleText = ""

        if (autoRatio == true) {
            barTitleText = "Transit vs. Auto Average " + opportunityDetails[opportunity]["title"] + " in " + regionDetails[region]["name"] + " for the Week of " + barDate.toDateString()
        }
        else {
            barTitleText = "Average " + opportunityDetails[opportunity]["title"] + " in " + regionDetails[region]["name"] + " for the Week of " + barDate.toDateString()
        }

        barChartSVG.append('text')
            .attr('class', 'barDateTitle')
            .attr('x', barChartWidth / 2)
            .attr('y', 30)
            // .attr("dy", "-1.55em")
            .text(barTitleText)
            .attr('text-anchor', 'middle')
            .attr("class", "text-md font-bold")

        // Subtitle first row
        barChartSVG.append('text')
            .attr('class', 'barDateSubtitle')
            .attr('x', barChartWidth / 2)
            .attr('y', 50)
            // .attr("dy", "-1.55em")
            .text(ylabel + " | " + tripOptionNames[tripOption] + " | " + todNames[period] + " | " + areaNames[area])
            .attr('text-anchor', 'middle')
            .attr("class", 'text-sm')

        // Subtitle second row
        barChartSVG.append('text')
            .attr('class', 'barDateSubtitle')
            .attr('x', barChartWidth / 2)
            .attr('y', 70)
            // .attr("dy", "-1.55em")
            .text(dataNote)
            .attr('text-anchor', 'middle')
            .attr("class", 'text-xs')

        // chartSVG.selectAll(".stickText")
        //     .transition()
        //     .style('font-weight', function (d) {
        //         if (d == barDate) {
        //             return 'bold'
        //         }
        //         else {
        //             return 'normal'
        //         }
        //     })

        chartSVG.selectAll('.theStick')
            .transition()
            .attr("stroke", function (d) {
                if (d == barDate) {
                    return '#BEBEBE'
                }
                else {
                    return "#F1F1F1"
                }
            })
    }
}