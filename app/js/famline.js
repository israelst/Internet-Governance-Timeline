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

        function cx(d){
            return (x(d.date[0]) + x(d.date[1]))/2;
        }

        selection
            .style('fill-opacity', 0.3)
            .attr('cx', cx)
            .attr('cy', maxDuration)
            .attr('r', function(d){
                return cx(d) - x(d.date[0]);
            });
    }

    return chart;
};
