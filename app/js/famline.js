var d3 = require('d3'),
    dates = require('./date.js').domainOfDates;

exports.FamlineChart = function(){
    var minWidth = 800;

    function chart(svg){
        var data = svg.datum(),
            width = Math.max(svg.attr('width'), minWidth),
            x = d3.time.scale().range([0, width]).domain(dates(data)),
            biggerRadius = d3.max(data.map(radius)),
            kinds = d3.set(data.map(kind)).values(),
            height = (biggerRadius * 3) * kinds.length,
            y = d3.scale.ordinal().rangePoints([0, height]).domain(kinds);

        function kind(d){
            return d.institutions;
        }

        function cx(d){
            return (x(d.date[0]) + x(d.date[1]))/2;
        }

        function radius(d){
            return cx(d) - x(d.date[0]);
        }

        svg.attr('height', height)
            .attr('width', width);

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

        var groupedByKind = svg.append('g')
            .attr('class', 'events-by-kind')
            .attr('transform', 'translate(0,' + biggerRadius * 4 + ')');

        groupedByKind.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .style('fill-opacity', 0.3)
            .attr('cx', cx)
            .attr('cy', function(d){ return y(d.institutions);})
            .attr('r', radius);

        groupedByKind.selectAll('line')
            .data(kinds)
            .enter()
            .append('line')
            .attr('x1', 0)
            .attr('y1', y)
            .attr('x2', width)
            .attr('y2', y)
            .style('stroke', 'black' );

    }

    return chart;
};
