const MAX_CATEGORY_COUNT = 20;
const MAX_PRODUCTS_AGE = 6.05 * Math.pow(10, 8);  // one week in milliseconds

var randomColorFactor = function () {
    return Math.round(Math.random() * 255);
};

var randomColor = function (opacity) {
    return 'rgba('
        + randomColorFactor()
        + ','
        + randomColorFactor()
        + ','
        + randomColorFactor()
        + ','
        + (opacity || '.3')
        + ')';
};

// instantiate empty placeholder chart
window.chart = new Chart("chart-area", {
    type: "horizontalBar",
    data:  {
        datasets: [{
            label: "Top " + MAX_CATEGORY_COUNT + " Industries by Company Count",
            data: [],
            backgroundColor: [],
            hoverBackgroundColor: []
        }],
        labels: []
    }
});

function isExpired (oldDate) {
    let currentDate = new Date().getTime();
    return currentDate - oldDate > MAX_PRODUCTS_AGE;
};

// load product name-name_slug map into storage
// might consider giving more unique name to 'productsMap'
$(function () {
    if (!localStorage.getItem("productsMap") ||
        isExpired(JSON.parse(localStorage.getItem("productsMap")).timestamp)) {

        // NOTE might want to use axios - research needed
        $.getJSON( "static/products.json", function (data) {
            let productsMap = data.data.reduce(function (total, current) {
                total[current.name] = current.name_slug;
                return total;
            });
            productsMap["timestamp"] = new Date().getTime();
            localStorage.setItem("productsMap", JSON.stringify(productsMap));
        });
    }
});

// autocomplete product names using jQuery-ui
// NOTE could use a vue component instead
$(function () {
    let productsMap = JSON.parse(localStorage.getItem("productsMap"));
    $("#product").autocomplete({source: Object.keys(productsMap)});
});

// TODO properly associate value of #product input field to vue instance
// TODO determine why chart element can't be encompassed by #app el
var vm = new Vue({
    el: "#app",
    data: {
        product: "" // placeholder
    },
    methods: {
        getCompanies: getCompanies
    }
});

function getCompanies (event) {
    let productName = $("#product")[0].value;  // hack - ought to access via vue instance
    let productSlug = JSON.parse(localStorage.getItem("productsMap"))[productName];

    // NOTE consider using axios instead
    $.get("/companies/" + productSlug, updateChart);
}

function updateChart (data) {
    // consider moving to separate 'fail' function
    if (data.status !== "success") {
        alert("Company data for product not found.");
    } else {
        let topCategories = data.data.slice(0, MAX_CATEGORY_COUNT);
        if (data.data.length > MAX_CATEGORY_COUNT) {
            let aggregatedCategory = data
                    .data
                    .slice(MAX_CATEGORY_COUNT)
                    .map(function (x) {return x.count;})
                    .reduce(function (x, y) {return x + y;});
            topCategories.push({
                "count": aggregatedCategory,
                "industry": data
                    .data
                    .slice(MAX_CATEGORY_COUNT)
                    .length + " smaller industries"
            });
        }
        let colors = topCategories.map(function () {
            return randomColor(0.7);
        });
        let industries = topCategories.map(function (e) {
            return e["industry"];
        });
        let counts = topCategories.map(function (e) {
            return e["count"];
        });

        // NOTE animation requires mutating one step at a time
        // could chart be made 'reactive' and therefore encompassed by vue?...
        window.chart.data.labels = industries;
        window.chart.data.datasets[0].data = counts;
        window.chart.data.datasets[0].backgroundColor = colors;
        window.chart.data.datasets[0].hoverBackgroundColor = colors;

        window.chart.update();
    }
}
