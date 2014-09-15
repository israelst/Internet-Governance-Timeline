var d3 = require('d3'),
    domainOfDates = require('./date.js').domainOfDates;

exports.FamlineChart = function(){
    function chart(selection){
        var extent = domainOfDates(selection.data()),
            width = selection.node().ownerSVGElement.width.baseVal.value,
            x = d3.time.scale().domain(extent).range([0, width]),
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
