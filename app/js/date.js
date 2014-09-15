var d3 = require('d3');

exports.domainOfDates = function (data){
    var startDates = data.map(function(d){return d.date[0];}),
        endDates = data.map(function(d){return d.date[1];}),
        dateExtent = d3.extent(startDates.concat(endDates))
                     .map(function(d){ return new Date(d);});
    dateExtent[0].setDate(1);
    dateExtent[1].setMonth(dateExtent[1].getMonth() + 1);
    dateExtent[1].setDate(0);
    return dateExtent;
};

