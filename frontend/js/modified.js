var barChart
var page_viewsChart
optionArray = {
    year: null,
    topic: null,
    sector: null,
    pest: null,
    region: null
}
function canvasError(id){
    if (id === "page_views"){
        page_viewsChart.destroy()
        textString = "NULL"
    }
    else{
        barChart.destroy()
        textString = "NO RECORDS!"
    }
    canvas = document.getElementById(id)
    ctx = document.getElementById(id).getContext("2d");
    ctx.fillStyle = "#706f9a";
    ctx.font = "32px sans-serif";
    textWidth = ctx.measureText(textString ).width;

    ctx.fillText(textString, (canvas.width/2) - (textWidth / 2), 100);
}
function apexChartError(id){
    document.getElementById(id).innerHTML="<h1 style='font-size:32px;text-align:center;color:#706f9a'>NO RECORDS FOUND!</h1>"
}
//article-year chart
function plotArticleYearGraph(label, dataPoints) {
    if (barChart != null){
        barChart.destroy()
    }
    var e = $("#bar").get(0).getContext("2d");
    e.height = 20;
    barChart = new Chart(e, {
        type: "bar",
        data: {
            labels: label,
            datasets: [{
                label: "Events",
                backgroundColor: "#1ccab8",
                borderColor: "transparent",
                borderWidth: 2,
                categoryPercentage: 0.5,
                hoverBackgroundColor: "#00d8c2",
                hoverBorderColor: "transparent",
                data: dataPoints,
            }, ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: !1,
                labels: {
                    fontColor: "#50649c"
                }
            },
            tooltips: {
                enabled: !0,
                callbacks: {
                    label: function (e, a) {
                        return (
                            e.yLabel + " " + a.datasets[e.datasetIndex].label
                        );
                    },
                },
            },
            scales: {
                xAxes: [{
                    barPercentage: 0.35,
                    categoryPercentage: 0.4,
                    display: !0,
                    gridLines: {
                        color: "transparent",
                        borderDash: [0],
                        zeroLineColor: "transparent",
                        zeroLineBorderDash: [2],
                        zeroLineBorderDashOffset: [2],
                    },
                    ticks: {
                        fontColor: "#a4abc5",
                        beginAtZero: !0,
                        padding: 12
                    },
                }, ],
                yAxes: [{
                    gridLines: {
                        color: "#8997bd29",
                        borderDash: [3],
                        drawBorder: !1,
                        drawTicks: !1,
                        zeroLineColor: "#8997bd29",
                        zeroLineBorderDash: [2],
                        zeroLineBorderDashOffset: [2],
                    },
                    ticks: {
                        fontColor: "#a4abc5",
                        beginAtZero: !0,
                        padding: 12,
                        callback: function (e) {
                            if (!(e % 10)) return e;
                        },
                    },
                }, ],
            },
        },
    });
}

function renderArticleYearGraph() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        jsonObj = JSON.parse(this.responseText);
        if (jsonObj["message"] === "SUCCESS"){
            labels = jsonObj["result"][0]
            data = jsonObj["result"][1]
            plotArticleYearGraph(labels, data)
        }
        else{
            canvasError("bar");
        }
    }
    xhttp.open("GET", "http://localhost:5000/getYears?"+$.param(optionArray), true);
    xhttp.send();
}
renderArticleYearGraph()

function plotTopSevenGraph(label,dataPoints){
    if (page_viewsChart != null){
        page_viewsChart.destroy()
    }
    var r = $("#page_views").get(0).getContext("2d");
    page_viewsChart = new Chart(r, {
      type: "bar",
      data: {
        labels: label,
        datasets: [
          {
            backgroundColor: [
              "#64C5B1",
              "#64C5B1",
              "#64C5B1",
              "#64C5B1",
              "#64C5B1",
              "#64C5B1",
              "#64C5B1",
            ],
            data: dataPoints,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: { display: !1 },
        tooltips: { intersect: !1, mode: "nearest" },
        legend: { display: !1 },
        responsive: !0,
        maintainAspectRatio: !1,
        barRadius: 2,
        scales: {
          xAxes: [
            {
              barThickness: 5,
              display: !1,
              gridLines: !1,
              ticks: { beginAtZero: !0 },
            },
          ],
          yAxes: [{ display: !1, gridLines: !1, ticks: { beginAtZero: !0 } }],
        },
        layout: { padding: { left: 0, right: 0, top: 0, bottom: 0 } },
      },
    });
}
function renderTopSevenGraph() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        jsonObj = JSON.parse(this.responseText);
        if (jsonObj["message"] === "SUCCESS"){
            labels = jsonObj["result"][0]
            data = jsonObj["result"][1]
            plotTopSevenGraph(labels, data)
        }
        else{
            canvasError("page_views");
        }
    }
    xhttp.open("GET", "http://localhost:5000/getTopSevenTopics?"+$.param(optionArray), true);
    xhttp.send();
}
renderTopSevenGraph()
//article average chart
function plotAverageQualityGraph(label, dataPoints) {
    document.getElementById("marketchart").innerHTML = ""
    var options1 = {
        chart: {
            type: 'radar',
            toolbar: {
                show: false
            }
        },
        series: [{
            name: 'Average Value',
            data: dataPoints,
        }],
        stroke: {
            width: 3,
            curve: 'smooth',
        },
        labels: label,
        plotOptions: {
            radar: {
                polygons: {
                    fill: {
                        colors: ['#fcf8ff', '#f7eeff']
                    }
                }
            }
        },
        colors: ["#64C5B1"],
        markers: {
            size: 6,
            colors: ['#fff'],
            strokeColor: "#64C5B1",
            strokeWidth: 5,
        },
        yaxis: {
            tickAmount: 4
        }   
    }
    var chart1 = new ApexCharts(document.querySelector("#marketchart"), options1);
    chart1.render();
}

function renderAverageQualityGraph() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        jsonObj = JSON.parse(this.responseText);
        if (jsonObj["message"] === "SUCCESS"){
            labels = Object.keys(jsonObj["result"])
            data = Object.values(jsonObj["result"])
            plotAverageQualityGraph(labels, data)
        }
        else{
            apexChartError("marketchart");
        }
    }
    xhttp.open("GET", "http://localhost:5000/averageQuality?"+$.param(optionArray), true);
    xhttp.send();
}
renderAverageQualityGraph()

function plotCountryGraph(label, dataPoints) {
    document.getElementById("region_chart").innerHTML=""
    var options = {
        series: dataPoints,
        labels: label,
        chart: {
            type: 'donut',
        },
        colors: ['#64c5b1', '#4bcdf6', '#162874', '#f16060', '#475256'],
    };

    var chart = new ApexCharts(document.querySelector("#region_chart"), options);
    chart.render();
}

function renderCountryGraph() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        jsonObj = JSON.parse(this.responseText);
        if (jsonObj["message"] === "SUCCESS"){
            labels = jsonObj["result"][0]
            data = jsonObj["result"][1]
            plotCountryGraph(labels, data)
        }
        else{
            apexChartError("region_chart")
        }
    }
    xhttp.open("GET", "http://localhost:5000/getRegion?"+$.param(optionArray), true);
    xhttp.send();
}
renderCountryGraph()

function plotRegionGraph(dataArray) {
    document.getElementById("country_chart").innerHTML=""
    var options = {
        series: [{
            data: dataArray
        }],
        legend: {
            show: false
        },
        chart: {
            height: 500,
            type: 'treemap'
        },
        title: {
            text: 'Most Involved Countries',
            align: 'center'
        },
        colors: [
            '#3B93A5',
            '#F7B844',
            '#ADD8C7',
            '#EC3C65',
            '#CDD7B6',
            '#C1F666',
            '#D43F97',
            '#1E5D8C',
            '#421243',
            '#7F94B0',
            '#EF6537',
            '#C0ADDB'
        ],
        plotOptions: {
            treemap: {
                distributed: true,
                enableShades: false
            }
        }
    };

    var chart = new ApexCharts(document.querySelector("#country_chart"), options);
    chart.render();
}
function renderRegionGraph() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        jsonObj = JSON.parse(this.responseText);
        if (jsonObj["message"] === "SUCCESS"){
            labels = jsonObj["result"][0]
            data = jsonObj["result"][1]
            dataArray = []
            max = (data.length>20) ? 20:data.length
            for (i=0;i<max;i++){
                dataArray.push(
                    {
                        x: labels[i],
                        y: data[i]
                    }
                )
            }
            plotRegionGraph(dataArray)
        }
        else{
            apexChartError("country_chart")
        }
    }
    xhttp.open("GET", "http://localhost:5000/getCountries?"+$.param(optionArray), true);
    xhttp.send();
}
renderRegionGraph()

function plotThreeQualityGraph(label,intensity,relevance,likelihood,topics){
    document.getElementById("apex_3").innerHTML=""
    var options = {
        series: [{
            name: 'Intensity',
            data: intensity
        }, {
            name: 'Relevance',
            data: relevance
        },{
            name: 'Likelihood',
            data: likelihood
        }
        ],
        chart: {
            height: 600,
            type: 'line'
        },
        colors: ['#f16060','#008ffb','#00d8c2'],
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            type: 'category',
            categories: label
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val
                }
            },
            x: {
                formatter: function(index) {
                    return "Year: <b>"+label[index-1]+"</b><br>"+
                    "Topics: <b>"+topics[index-1]+"</b>"
                }
            },
        },
    };
    var chart = new ApexCharts(document.querySelector("#apex_3"), options);
    chart.render();
}
function renderThreeQualityGraph() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        jsonObj = JSON.parse(this.responseText);
        if (jsonObj["message"] === "SUCCESS"){
            labels = jsonObj["result"][0]
            intensity = jsonObj["result"][1]
            relevance = jsonObj["result"][2]
            likelihood = jsonObj["result"][3]
            topics = jsonObj["result"][4]
            plotThreeQualityGraph(labels,intensity,relevance,likelihood,topics)
        }
        else{
            apexChartError("apex_3")
        }
    }
    xhttp.open("GET", "http://localhost:5000/getThreeQuality?"+$.param(optionArray), true);
    xhttp.send();
}
renderThreeQualityGraph()

function renderOptions() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        jsonObj = JSON.parse(this.responseText);
        yearList = jsonObj["result"][0]
        topicList = jsonObj["result"][1]
        sectorList = jsonObj["result"][2]
        pestleList = jsonObj["result"][4]
        regionList = jsonObj["result"][3]
        for(i=0;i<yearList.length;i++){
            document.getElementById("yearList").innerHTML += 
            '<a class="dropdown-item" href="#" onclick="selectOption(0,this)">'+yearList[i]+'</a>'
        }
        for(i=0;i<topicList.length;i++){
            document.getElementById("topicList").innerHTML += 
            '<a class="dropdown-item" href="#" onclick="selectOption(1,this)">'+topicList[i]+'</a>'
        }
        for(i=0;i<sectorList.length;i++){
            document.getElementById("sectorList").innerHTML += 
            '<a class="dropdown-item" href="#" onclick="selectOption(2,this)">'+sectorList[i]+'</a>'
        }
        for(i=0;i<pestleList.length;i++){
            document.getElementById("pestleList").innerHTML += 
            '<a class="dropdown-item" href="#" onclick="selectOption(3,this)">'+pestleList[i]+'</a>'
        }
        for(i=0;i<regionList.length;i++){
            document.getElementById("regionList").innerHTML += 
            '<a class="dropdown-item" href="#" onclick="selectOption(4,this)">'+regionList[i]+'</a>'
        }
    }
    xhttp.open("GET", "http://localhost:5000/getOptions", true);
    xhttp.send();
}

function selectOption(index,object){
    switch(index){
        case 0:
            document.getElementById("yearSelected").innerHTML= "Year : " + object.innerHTML
            optionArray["year"] = object.innerHTML
            renderArticleYearGraph()
            renderAverageQualityGraph()
            renderCountryGraph()
            renderRegionGraph()
            renderThreeQualityGraph()
            renderTopSevenGraph()
            break
        case 1:
            document.getElementById("topicSelected").innerHTML= "Topics : " + object.innerHTML
            optionArray["topic"] = object.innerHTML
            renderArticleYearGraph()
            renderAverageQualityGraph()
            renderCountryGraph()
            renderRegionGraph()
            renderThreeQualityGraph()
            renderTopSevenGraph()
            break;
        case 2:
            document.getElementById("sectorSelected").innerHTML= "Sector : " + object.innerHTML
            optionArray["sector"] = object.innerHTML
            renderArticleYearGraph()
            renderAverageQualityGraph()
            renderCountryGraph()
            renderRegionGraph()
            renderThreeQualityGraph()
            renderTopSevenGraph()
            break;
        case 3:
            document.getElementById("pestleSelected").innerHTML= "PEST : " + object.innerHTML
            optionArray["pest"] = object.innerHTML
            renderArticleYearGraph()
            renderAverageQualityGraph()
            renderCountryGraph()
            renderRegionGraph()
            renderThreeQualityGraph()
            renderTopSevenGraph()
            break
        case 4:
            document.getElementById("regionSelected").innerHTML= "Region : " + object.innerHTML
            optionArray["region"] = object.innerHTML
            renderArticleYearGraph()
            renderAverageQualityGraph()
            renderCountryGraph()
            renderRegionGraph()
            renderThreeQualityGraph()
            renderTopSevenGraph()
            break
    }
}

renderOptions()