$( function() {
    $.getJSON( "static/products.json", function(data) {
        var products = data.data;
        $( "#products" ).autocomplete({
            source: products.map(function(p) {return p.name;})
        });
    });
} ); // add autocomplete to search field
