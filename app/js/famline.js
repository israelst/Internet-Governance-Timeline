var d3 = require('d3');

function domainOfDates(data){
    var startDates = data.map(function(d){return d.date[0];}),
        endDates = data.map(function(d){return d.date[1];});

    var dateExtent = d3.extent(startDates.concat(endDates))
                     .map(function(d){ return new Date(d);});
    dateExtent[0].setDate(1);
    dateExtent[1].setMonth(dateExtent[1].getMonth() + 1);
    dateExtent[1].setDate(0);
    return dateExtent;
}

exports.FamlineChart = function(){
    function chart(selection){
        var extent = domainOfDates(selection.data()),
            x = d3.time.scale().domain(extent).range([0, 500]),
            maxDuration = d3.max(
                    selection.data().map(function(d){
                        return d.duration;
                    }));

        selection
            .attr('cx', function(d){ return x(d.date[0]);})
            .attr('cy', maxDuration)
            .attr('r', function(d){ return d.duration;});
    }

    return chart;
};
