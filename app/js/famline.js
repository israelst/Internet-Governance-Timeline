var d3 = require('d3'),
    domainOfDates = require('./date.js').domainOfDates;

exports.FamlineChart = function(){
    var minWidth = 500;

    function chart(selection){
        var data = selection.data(),
            svg = selection.node().ownerSVGElement,
            width = svg.width.baseVal.value,
            x = d3.time.scale(),
            maxDuration = d3.max(
                data.map(function(d){
                    return d.duration;
                }));

        width = Math.max(width, minWidth);
        x.domain(domainOfDates(data)).range([0, width]);

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
