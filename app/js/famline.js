var d3 = require('d3'),
    domainOfDates = require('./date.js').domainOfDates;

exports.FamlineChart = function(){
    var minWidth = 500,
        padding = 10;

    function chart(svg){
        var data = svg.datum(),
            width = Math.max(svg.attr('width'), minWidth),
            maxDuration = d3.max(
                data.map(function(d){
                    return d.duration;
                }));
            x = d3.time.scale().range([0, width]).domain(domainOfDates(data)),
            biggerRadius = maxDuration, //d3.max(data.map(radius)),
            kinds = d3.set(data.map(function(d){ return d.institutions;})).values(),
            height = (biggerRadius * 4) * kinds.length,
            y = d3.scale.ordinal().rangePoints([0, height], padding).domain(kinds);

        svg.attr('height', height);

        function cx(d){
            return (x(d.date[0]) + x(d.date[1]))/2;
        }

        function radius(d){
            return cx(d) - x(d.date[0]);
        }

        svg.append('g')
            .attr('class', 'all-events')
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .style('fill-opacity', 0.3)
            .attr('cx', cx)
            .attr('cy', biggerRadius)
            .attr('r', radius);

        svg.append('g')
            .attr('class', 'events-by-kind')
            .attr('transform', 'translate(0,' + biggerRadius + ')')
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .style('fill-opacity', 0.3)
            .attr('cx', cx)
            .attr('cy', function(d){ return y(d.institutions);})
            .attr('r', radius);

    }

    return chart;
};
