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
    type: "pie",
    data:  {
        datasets: [{data: [], backgroundColor: [], hoverBackgroundColor: []}],
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
            $.get("/companies/" + productsObj[productEl.val()], function (data) {
                if (data.companies_count === 0) {
                    alert("Company data for product not found.");
                } else {
                    var colors = data.data.map(function () {
                        return randomColor(0.7);
                    });
                    var industries = data.data.map(function (e) {
                        return e["industry"];
                    });
                    var counts = data.data.map(function (e) {
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
