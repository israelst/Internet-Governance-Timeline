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

        var yAxis = d3.svg.axis().scale(y).orient('right')
             .tickValues(y.domain())
             .tickFormat(y.invert)
             .tickSize(width)
             .tickPadding(-5);

        groupedByKind
            .append('g')
            .attr('class', 'axis')
            .call(yAxis)
            .selectAll('text')
            .attr('y', -5)
            .attr('dy', '.35em')
            .style('text-transform', 'uppercase')
            .style('text-anchor', 'end');

        groupedByKind.selectAll('.domain')
             .style('display', 'none' );

        groupedByKind.selectAll('.tick line')
             .style('shape-rendering', 'crispEdges' )
             .style('stroke-dasharray', 3)
             .style('stroke', '#333' );

    }

    return chart;
};
