var MAX_CATEGORY_COUNT = 20;

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

var ctx = "chart-area";
window.chart = new Chart(ctx, {
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

$(function () {
    $.getJSON( "static/products.json", function (data) {
        var productsObj = data.data.reduce(function (total, current) {
            total[current.name] = current.name_slug;
            return total;
        }, {});  // dump array into object

        var productEl = $("#product");

        productEl.autocomplete({ source: Object.keys(productsObj) });

        $("#viewCompanies").button().click(function (event) {
            event.preventDefault();

            /**
             * this third party API call (which is proxied) takes a long time
             * TODO app ought to display spinner while data is loading
             * there doesn't seem to be much opportunity for pre-loading
             * you could, however, cache results once loaded
             */

            $.get("/companies/" + productsObj[productEl.val()], function (data) {
                if (data.status !== "success") {
                    alert("Company data for product not found.");
                } else {
                    var topCategories = data.data.slice(0, MAX_CATEGORY_COUNT);
                    if (data.data.length > MAX_CATEGORY_COUNT) {
                        var aggregatedCategory = data
                                .data
                                .slice(MAX_CATEGORY_COUNT)
                                .map(function (x) {return x.count;})
                                .reduce(function (x, y) {
                                    return x + y;
                                }); // can't seem to fold map into reduce...
                        topCategories.push({
                            "count": aggregatedCategory,
                            "industry": data
                                .data
                                .slice(MAX_CATEGORY_COUNT)
                                .length + " smaller industries"
                        });
                    } // aggregate remaining industries into one category

                    var colors = topCategories.map(function () {
                        return randomColor(0.7);
                    });
                    var industries = topCategories.map(function (e) {
                        return e["industry"];
                    });
                    var counts = topCategories.map(function (e) {
                        return e["count"];
                    });

                    // NOTE animation requires mutating one step at a time
                    window.chart.data.labels = industries;
                    window.chart.data.datasets[0].data = counts;
                    window.chart.data.datasets[0].backgroundColor = colors;
                    window.chart.data.datasets[0].hoverBackgroundColor = colors;

                    window.chart.update();
                }
            });
        });
    });
});
