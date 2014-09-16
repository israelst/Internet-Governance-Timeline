var d3 = require('d3');

exports.domainOfDates = function (data){
    var startDates = data.map(function(d){return d.date[0];}),
        endDates = data.map(function(d){return d.date[1];}),
        extent = d3.extent(startDates.concat(endDates))
            .map(function(d){ return new Date(d);});
    return [d3.time.month.floor(extent[0]),
            d3.time.month.ceil(extent[1])];
};

