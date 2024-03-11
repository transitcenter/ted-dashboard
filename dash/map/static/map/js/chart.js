var popStyle = {
    'B03002_001E': {
        'label': 'Everyone',
        'sentence': 'everyone',
        'color': "#bab0ac"
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
    'B11003_016': {
        'label': 'Single Mother',
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

let chartMargin = {top: 100, right: 10, bottom: 30, left: 100}
let barChartMargin = {top: 20, right: 20, bottom: 30, left: 20}

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

updateChart()

function updateChart() {
    console.log("Update Chart")

    var region = document.getElementById("region").value;
    var period = document.getElementById("period").value;
    var opportunity = document.getElementById("opportunity").value;
    var tripOption = document.getElementById("tripOptions").value;
    // Let's load the proper CSV based on settings (just one right now)
    d3.csv("/static/map/data/summary_" + region + "_" + period + ".csv")
        .then(function (data) {
            // console.log(data)
            //TODO: dynamic keys
            var scoreKey = opportunity + "_" + tripOption
            // TODO: Filter the dates and demographics
            var scores = []
            data.forEach(function (item, index) {
                // TODO: Update to clean this up
                if (item.demographic != "C17002_003E") {
                    var obj = {};
                    obj["demographic"] = item.demographic;
                    obj["value"] = +item[scoreKey];
                    obj["date"] = new Date(item.date);
                    scores.push(obj);
                }
            })
            multilinePlot(scores);
        })
}

function multilinePlot(scores) {

    chartSVG.selectAll('*').remove();

    scores.sort((a, b) => d3.ascending(a.date, b.date));
    var maxDate = d3.max(scores, d => d['date']);

    let barDate = maxDate;
    var barScores = scores.filter(d => d['date'] == barDate);
    barScores = barScores.sort((a, b) => d3.ascending(a.value, b.value))
    console.log(d3.extent(scores, d => d.date))
    console.log(d3.extent(scores, d => d.value))

    var x = d3.scaleTime()
        .domain([Date.parse("2020-02-01"), maxDate])
        .rangeRound([chartMargin.left, chartBoxWidth])

    var y = d3.scaleLinear()
        .domain([0, d3.max(scores, d => d.value)])
        .range([chartBoxHeight + chartMargin.top, chartMargin.top])

    console.log(d3.max(scores, d => d.value))

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

    console.log(dateList);

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

    var stickTexts = chartSVG.selectAll("stickLabel")
        .data(dateList)
        .enter()
        .append("text")
        .attr("class", 'stickText')
        // .attr("x", d => x(d))
        // .attr('y', -18)
        .attr("transform", d => "translate(" + (x(d) + 5) + "," + (chartMargin.top - 5) + ") rotate(45)")
        // .attr("dy", "-.75em")
        // .attr('dx')
        .text(d => d.toLocaleDateString("en-US", {month: "short", day: "numeric", year: "2-digit"}))
        .attr('text-anchor', 'end')
        .attr("dy", ".35em")
        .attr("font-size", "0.7em")
        .style('cursor', 'pointer')
        .style('font-weight', function (d) {
            if (d == barDate) {
                return 'bold'
            }
            else {
                return 'normal'
            }
        })


    // chartSVG.append('text')
    //     .attr('class', 'barDateLabel')
    //     .attr('x', chartWidth + 10)
    //     .attr('y', 0)
    //     // .attr("dy", "-1.55em")
    //     .text("Week of " + barDate)
    //     .attr('text-anchor', 'start')
    //     .attr("font-size", "0.8em")

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
                    return 4;
                }
                else {
                    return 3;
                }
            })
            .style('opacity', function () {
                if (key == 'B03002_001E') {
                    return 1.0;
                }
                else {
                    return 0.7;
                }
            })

        path.on('mouseover', function (e, d) {
            //TODO: DO STUFF
        })
    })

    //     chartSVG.append("text")
    //         .attr("transform", "rotate(-90)")
    //         .attr("y", 0 - chartMargin.left)
    //         .attr("x", 0 - (chartHeight / 2))
    //         .attr("dy", "1em")
    //         .style("text-anchor", "middle")
    //         .text(ylabel);

    chartSVG.append("g")
        .attr("transform", "translate(" + chartMargin.left + ", 0)")
        .call(d3.axisLeft(y).ticks(5));


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
    // });

    // var barY = d3.scaleBand()
    //     .domain(barScores.map(d => popStyle[d.description].label))
    //     .range([chartHeight, 10])
    //     .padding(0.1);

    // var barX = d3.scaleLinear()
    //     .domain([0, d3.max(barScores, d => d.value)])
    //     .range([0, chartMargin.right - 20])

    // var bars = chartSVG.selectAll('bars')
    //     .data(barScores)
    //     .enter()
    //     .append('rect')
    //     .attr('class', 'mpbar')
    //     .attr("y", d => barY(popStyle[d.description].label))
    //     .attr("x", d => chartWidth + 10)
    //     .attr("height", barY.bandwidth())
    //     .attr("width", d => barX(d.value))
    //     .style("opacity", function (d) {
    //         if (d.description == 'pop_total') {
    //             return 1.0;
    //         }
    //         else {
    //             return 0.5;
    //         }
    //     })
    //     .attr("fill", d => popStyle[d.description].color)

    // var barLabels = chartSVG.selectAll("barlabel")
    //     .data(barScores)
    //     .enter()
    //     .append("text")
    //     .attr('class', 'mpbarText')
    //     .attr("x", d => chartWidth + 14)
    //     .attr('y', d => barY(popStyle[d.description].label) + barY.bandwidth() / 2)
    //     .text(d => popStyle[d.description].label + " (" + styleNumbers(d.value) + ")")
    //     .attr('text-anchor', 'left')
    //     .attr("dy", ".35em")
    //     .attr("font-size", "0.8em")
    //     .style('fill', function (d) {
    //         if (d.description == 'pop_total') {
    //             return 'white';
    //         }
    //         else {
    //             return 'black';
    //         }
    //     })

    // // Now some mouse effects
    // stickTexts.on('click', function (d) {
    //     updateBars(d)
    // })

    sticks.on('click', function (e, d) {
        console.log(d);
        updateBars(d);
    })

    sticks.on('mouseover', function (d) {
        d3.select(this)
            .transition()
            .attr('stroke', '#2D74ED')
            .attr('opacity', 0.5)
        // Highlight the connections
    })
        .on('mouseout', function (d) {
            if (d == barDate) {
                d3.select(this).transition().attr('stroke', '#BEBEBE')
            }
            else {
                d3.select(this).transition().attr('stroke', '#F1F1F1')
            }

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
                    return 0.5;
                }
            })

    }
}